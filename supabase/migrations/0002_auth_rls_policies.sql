-- Drop open v1 policies on leads
DROP POLICY IF EXISTS leads_v1_read ON leads;
DROP POLICY IF EXISTS leads_v1_write ON leads;

-- Drop open v1 policies on touchpoints
DROP POLICY IF EXISTS touchpoints_v1_read ON touchpoints;
DROP POLICY IF EXISTS touchpoints_v1_write ON touchpoints;

-- Leads: authenticated users see their own rows + seed rows (user_id IS NULL)
CREATE POLICY leads_select ON leads
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY leads_insert ON leads
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY leads_update ON leads
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY leads_delete ON leads
  FOR DELETE USING (user_id = auth.uid());

-- Touchpoints: authenticated users see their own rows + rows for seed leads
CREATE POLICY touchpoints_select ON touchpoints
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY touchpoints_insert ON touchpoints
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY touchpoints_update ON touchpoints
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY touchpoints_delete ON touchpoints
  FOR DELETE USING (user_id = auth.uid());
