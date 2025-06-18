-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    bio TEXT,
    website TEXT,
    avatar_url TEXT,
    user_type TEXT NOT NULL CHECK (user_type IN ('participant', 'organizer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_user_type ON profiles(user_type);

-- Create events table
CREATE TABLE events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organizer_id UUID REFERENCES profiles(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL CHECK (event_type IN ('hackathon', 'ideathon', 'workshop', 'conference', 'meetup')),
    format TEXT NOT NULL CHECK (format IN ('presential', 'online', 'hybrid')),
    location TEXT,
    online_url TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    cover_image_url TEXT,
    max_participants INTEGER,
    max_team_size INTEGER,
    registration_fee NUMERIC,
    is_featured BOOLEAN DEFAULT false,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Create indexes for events
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_events_type ON events(event_type);

-- Create teams table
CREATE TABLE teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES events(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    max_members INTEGER NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create team_members table
CREATE TABLE team_members (
    team_id UUID REFERENCES teams(id) NOT NULL,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('leader', 'member')),
    joined_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (team_id, user_id)
);

-- Create project_submissions table
CREATE TABLE project_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES events(id) NOT NULL,
    team_id UUID REFERENCES teams(id) NOT NULL,
    name TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    repository_url TEXT,
    demo_url TEXT,
    video_url TEXT,
    status TEXT NOT NULL CHECK (status IN ('draft', 'submitted', 'evaluated')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create project_evaluations table
CREATE TABLE project_evaluations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    submission_id UUID REFERENCES project_submissions(id) NOT NULL,
    evaluator_id UUID REFERENCES profiles(id) NOT NULL,
    innovation_score INTEGER NOT NULL CHECK (innovation_score BETWEEN 1 AND 10),
    execution_score INTEGER NOT NULL CHECK (execution_score BETWEEN 1 AND 10),
    impact_score INTEGER NOT NULL CHECK (impact_score BETWEEN 1 AND 10),
    presentation_score INTEGER NOT NULL CHECK (presentation_score BETWEEN 1 AND 10),
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_evaluations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
    ON profiles FOR DELETE
    USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Events are viewable by everyone"
    ON events FOR SELECT
    USING (true);

CREATE POLICY "Organizers can create events"
    ON events FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles WHERE user_type = 'organizer'
    ));

CREATE POLICY "Organizers can update their own events"
    ON events FOR UPDATE
    USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their events"
    ON events FOR DELETE
    USING (auth.uid() = organizer_id);

-- Teams policies
CREATE POLICY "Teams are viewable by everyone"
    ON teams FOR SELECT
    USING (true);

CREATE POLICY "Users can create teams"
    ON teams FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles
    ));

CREATE POLICY "Team leaders can update their teams"
    ON teams FOR UPDATE
    USING (auth.uid() IN (
        SELECT user_id FROM team_members 
        WHERE team_id = teams.id AND role = 'leader'
    ));

CREATE POLICY "Team leaders can delete their teams"
    ON teams FOR DELETE
    USING (auth.uid() IN (
        SELECT user_id FROM team_members 
        WHERE team_id = teams.id AND role = 'leader'
    ));

-- Team members policies
CREATE POLICY "Team members are viewable by everyone"
    ON team_members FOR SELECT
    USING (true);

CREATE POLICY "Team leaders can manage members"
    ON team_members FOR ALL
    USING (auth.uid() IN (
        SELECT user_id FROM team_members 
        WHERE team_id = team_members.team_id AND role = 'leader'
    ));

-- Project submissions policies
CREATE POLICY "Submissions are viewable by everyone"
    ON project_submissions FOR SELECT
    USING (true);

CREATE POLICY "Team members can create submissions"
    ON project_submissions FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT user_id FROM team_members 
        WHERE team_id = project_submissions.team_id
    ));

CREATE POLICY "Team members can update their submissions"
    ON project_submissions FOR UPDATE
    USING (auth.uid() IN (
        SELECT user_id FROM team_members 
        WHERE team_id = project_submissions.team_id
    ));

-- Project evaluations policies
CREATE POLICY "Evaluations are viewable by evaluators and team members"
    ON project_evaluations FOR SELECT
    USING (
        auth.uid() = evaluator_id OR
        auth.uid() IN (
            SELECT user_id FROM team_members 
            WHERE team_id IN (
                SELECT team_id FROM project_submissions 
                WHERE id = project_evaluations.submission_id
            )
        )
    );

CREATE POLICY "Organizers can create evaluations"
    ON project_evaluations FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles WHERE user_type = 'organizer'
    ));

CREATE POLICY "Organizers can update their evaluations"
    ON project_evaluations FOR UPDATE
    USING (auth.uid() = evaluator_id);

-- Create functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, email, user_type)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'first_name',
        new.raw_user_meta_data->>'last_name',
        new.email,
        'participant'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add cascade delete trigger for profiles
CREATE OR REPLACE FUNCTION public.handle_user_deletion()
RETURNS trigger AS $$
BEGIN
    -- Delete related records
    DELETE FROM project_evaluations WHERE evaluator_id = OLD.id;
    DELETE FROM team_members WHERE user_id = OLD.id;
    DELETE FROM events WHERE organizer_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_deleted
    BEFORE DELETE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_deletion();
