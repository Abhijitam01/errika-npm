-- Database schema for Errika statistics and tracking

-- Template statistics table
CREATE TABLE IF NOT EXISTS template_stats (
  id SERIAL PRIMARY KEY,
  template_id VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'view', 'download', 'generate'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Template metadata table
CREATE TABLE IF NOT EXISTS templates (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  stars INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Community showcase table
CREATE TABLE IF NOT EXISTS community_projects (
  id SERIAL PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  description TEXT,
  template_id VARCHAR(100) REFERENCES templates(id),
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  image_url VARCHAR(500),
  author_name VARCHAR(255),
  author_avatar VARCHAR(500),
  featured BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Template reviews table
CREATE TABLE IF NOT EXISTS template_reviews (
  id SERIAL PRIMARY KEY,
  template_id VARCHAR(100) REFERENCES templates(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  author_name VARCHAR(255),
  author_email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_template_stats_template_id ON template_stats(template_id);
CREATE INDEX IF NOT EXISTS idx_template_stats_created_at ON template_stats(created_at);
CREATE INDEX IF NOT EXISTS idx_community_projects_template_id ON community_projects(template_id);
CREATE INDEX IF NOT EXISTS idx_community_projects_featured ON community_projects(featured);
CREATE INDEX IF NOT EXISTS idx_template_reviews_template_id ON template_reviews(template_id);

-- View for aggregated template statistics
CREATE OR REPLACE VIEW template_statistics AS
SELECT 
  t.id,
  t.name,
  t.category,
  COALESCE(t.downloads, 0) as total_downloads,
  COALESCE(t.stars, 0) as stars,
  COUNT(CASE WHEN ts.event_type = 'view' AND ts.created_at > NOW() - INTERVAL '7 days' THEN 1 END) as views_last_7_days,
  COUNT(CASE WHEN ts.event_type = 'download' AND ts.created_at > NOW() - INTERVAL '7 days' THEN 1 END) as downloads_last_7_days,
  AVG(tr.rating) as average_rating,
  COUNT(tr.id) as review_count
FROM templates t
LEFT JOIN template_stats ts ON t.id = ts.template_id
LEFT JOIN template_reviews tr ON t.id = tr.template_id
GROUP BY t.id, t.name, t.category, t.downloads, t.stars;



