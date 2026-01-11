-- Allow admins to view all orders
-- Assuming 'profiles' table has 'id' matching auth.uid() and a 'role' column.

CREATE POLICY "Enable read access for admins" ON orders
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Also allow admins to update orders (for changing status to 'processing'/'shipped')
CREATE POLICY "Enable update access for admins" ON orders
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
