-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'advisor', 'student');
CREATE TYPE public.risk_tier AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE public.residency_status AS ENUM ('On-Campus', 'Off-Campus', 'Commuter');

-- Create students table
CREATE TABLE public.students (
  student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  gender TEXT,
  age INTEGER,
  residency_status residency_status,
  first_gen BOOLEAN DEFAULT FALSE,
  major TEXT,
  cumulative_gpa DECIMAL(3,2) CHECK (cumulative_gpa >= 0 AND cumulative_gpa <= 4.0),
  credits_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE public.courses (
  course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dept TEXT NOT NULL,
  level INTEGER,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create terms table
CREATE TABLE public.terms (
  term_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  weeks INTEGER DEFAULT 16,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(course_id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES public.terms(term_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id, term_id)
);

-- Create enrollment_grades table
CREATE TABLE public.enrollments_grades (
  enrollment_id UUID PRIMARY KEY REFERENCES public.enrollments(enrollment_id) ON DELETE CASCADE,
  numeric_grade DECIMAL(5,2),
  course_gpa DECIMAL(3,2) CHECK (course_gpa >= 0 AND course_gpa <= 4.0)
);

-- Create financial_aid table
CREATE TABLE public.financial_aid (
  student_id UUID PRIMARY KEY REFERENCES public.students(student_id) ON DELETE CASCADE,
  household_income_usd INTEGER,
  scholarship_flag BOOLEAN DEFAULT FALSE,
  aid_amount_usd INTEGER DEFAULT 0,
  work_hours_per_week INTEGER DEFAULT 0,
  outstanding_balance_usd INTEGER DEFAULT 0
);

-- Create LMS_events table
CREATE TABLE public.lms_events (
  event_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id UUID NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(course_id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES public.terms(term_id) ON DELETE CASCADE,
  grain TEXT,
  date DATE,
  time_on_platform_min INTEGER DEFAULT 0,
  logins INTEGER DEFAULT 0,
  assignments_submitted INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE public.attendance (
  attendance_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id UUID NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(course_id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES public.terms(term_id) ON DELETE CASCADE,
  month TEXT,
  attendance_pct DECIMAL(5,2) CHECK (attendance_pct >= 0 AND attendance_pct <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create term_gpas table
CREATE TABLE public.term_gpas (
  student_id UUID NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES public.terms(term_id) ON DELETE CASCADE,
  term_gpa DECIMAL(3,2) CHECK (term_gpa >= 0 AND term_gpa <= 4.0),
  PRIMARY KEY (student_id, term_id)
);

-- Create risk_scores table
CREATE TABLE public.risk_scores (
  student_id UUID PRIMARY KEY REFERENCES public.students(student_id) ON DELETE CASCADE,
  term_id UUID REFERENCES public.terms(term_id),
  risk_score DECIMAL(5,2) CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_tier risk_tier NOT NULL,
  intervention_type TEXT,
  note_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create advising_notes table
CREATE TABLE public.advising_notes (
  note_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id UUID NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
  advisor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  note_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  student_id UUID REFERENCES public.students(student_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_aid ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.term_gpas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advising_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for students - advisors can view all, students can view their own
CREATE POLICY "Advisors can view all students"
  ON public.students FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'advisor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own record"
  ON public.students FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.student_id = students.student_id
    )
  );

-- RLS policies for courses - all authenticated users can view
CREATE POLICY "Authenticated users can view courses"
  ON public.courses FOR SELECT
  TO authenticated
  USING (true);

-- RLS policies for terms - all authenticated users can view
CREATE POLICY "Authenticated users can view terms"
  ON public.terms FOR SELECT
  TO authenticated
  USING (true);

-- RLS policies for enrollments
CREATE POLICY "Advisors can view all enrollments"
  ON public.enrollments FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'advisor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own enrollments"
  ON public.enrollments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.student_id = enrollments.student_id
    )
  );

-- RLS policies for grades
CREATE POLICY "Advisors can view all grades"
  ON public.enrollments_grades FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'advisor') OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Students can view their own grades"
  ON public.enrollments_grades FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.profiles p ON p.student_id = e.student_id
      WHERE p.id = auth.uid() AND e.enrollment_id = enrollments_grades.enrollment_id
    )
  );

-- RLS policies for financial_aid (sensitive - only advisors and the student)
CREATE POLICY "Advisors can view all financial aid"
  ON public.financial_aid FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'advisor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own financial aid"
  ON public.financial_aid FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.student_id = financial_aid.student_id
    )
  );

-- RLS policies for LMS events
CREATE POLICY "Advisors can view all LMS events"
  ON public.lms_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'advisor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own LMS events"
  ON public.lms_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.student_id = lms_events.student_id
    )
  );

-- RLS policies for attendance
CREATE POLICY "Advisors can view all attendance"
  ON public.attendance FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'advisor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own attendance"
  ON public.attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.student_id = attendance.student_id
    )
  );

-- RLS policies for term GPAs
CREATE POLICY "Advisors can view all term GPAs"
  ON public.term_gpas FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'advisor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own term GPAs"
  ON public.term_gpas FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.student_id = term_gpas.student_id
    )
  );

-- RLS policies for risk scores
CREATE POLICY "Advisors can view all risk scores"
  ON public.risk_scores FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'advisor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can view their own risk score"
  ON public.risk_scores FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.student_id = risk_scores.student_id
    )
  );

-- RLS policies for advising notes
CREATE POLICY "Advisors can view all notes"
  ON public.advising_notes FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'advisor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Advisors can create notes"
  ON public.advising_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'advisor') OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Students can view their own notes"
  ON public.advising_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.student_id = advising_notes.student_id
    )
  );

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Advisors can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'advisor') OR public.has_role(auth.uid(), 'admin'));