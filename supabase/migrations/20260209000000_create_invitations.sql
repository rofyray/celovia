CREATE TABLE invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  template_id TEXT NOT NULL DEFAULT 'classic',
  memories JSONB NOT NULL,
  hints TEXT,
  style_config JSONB DEFAULT '{}',
  generated_message TEXT,
  generated_image_url TEXT,
  access_token TEXT UNIQUE NOT NULL,
  rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'accepted', 'declined')),
  rsvp_message TEXT,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invitations_token ON invitations(access_token);
