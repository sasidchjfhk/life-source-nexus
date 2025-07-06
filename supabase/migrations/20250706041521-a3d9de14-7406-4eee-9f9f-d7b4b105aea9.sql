-- Insert sample donors
INSERT INTO public.donors (name, blood_type, organ, location, availability) VALUES
('John Smith', 'O+', 'Kidney', 'New York, NY', true),
('Sarah Johnson', 'A-', 'Liver', 'Los Angeles, CA', true),
('Michael Chen', 'B+', 'Heart', 'Chicago, IL', true),
('Emily Davis', 'AB-', 'Kidney', 'Houston, TX', true),
('David Wilson', 'O-', 'Lung', 'Phoenix, AZ', true),
('Lisa Anderson', 'A+', 'Liver', 'Philadelphia, PA', true),
('Robert Taylor', 'B-', 'Heart', 'San Antonio, TX', true),
('Jennifer Brown', 'AB+', 'Kidney', 'San Diego, CA', true);

-- Insert sample recipients
INSERT INTO public.recipients (name, blood_type, required_organ, location, urgency_level) VALUES
('Maria Garcia', 'O+', 'Kidney', 'Dallas, TX', 9),
('James Martinez', 'A-', 'Liver', 'San Jose, CA', 8),
('Patricia Rodriguez', 'B+', 'Heart', 'Austin, TX', 10),
('Christopher Lee', 'AB-', 'Kidney', 'Jacksonville, FL', 7),
('Barbara Thomas', 'O-', 'Lung', 'San Francisco, CA', 9),
('William Jackson', 'A+', 'Liver', 'Indianapolis, IN', 6),
('Susan White', 'B-', 'Heart', 'Columbus, OH', 8),
('Daniel Harris', 'AB+', 'Kidney', 'Fort Worth, TX', 7);