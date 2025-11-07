-- Allow students to be inserted (for auto-creation on signup)
CREATE POLICY "Service role can insert students"
  ON public.students FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow risk scores to be inserted
CREATE POLICY "Service role can insert risk scores"
  ON public.risk_scores FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can update risk scores"
  ON public.risk_scores FOR UPDATE
  TO authenticated
  USING (true);

-- Allow attendance to be inserted
CREATE POLICY "Service role can insert attendance"
  ON public.attendance FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow LMS events to be inserted
CREATE POLICY "Service role can insert LMS events"
  ON public.lms_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow financial aid to be inserted
CREATE POLICY "Service role can insert financial aid"
  ON public.financial_aid FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow terms to be inserted
CREATE POLICY "Authenticated users can insert terms"
  ON public.terms FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow courses to be inserted
CREATE POLICY "Authenticated users can insert courses"
  ON public.courses FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow profiles to be updated (for linking student_id)
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());