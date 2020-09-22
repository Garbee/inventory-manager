CREATE OR REPLACE FUNCTION updated_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
      NEW.updated_at = now();
      RETURN NEW;
   ELSE
      RETURN OLD;
   END IF;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION guard_created_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   IF row(NEW.created_at) IS DISTINCT FROM row(OLD.created_at) THEN
      RAISE WARNING 'created_at can not be modified';
			NEW.created_at = OLD.created_at;
			return NEW;
   ELSE
      RETURN NEW;
   END IF;
END;
$$ language 'plpgsql';


CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    area TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industryIdentifiers JSONB,
    name TEXT NULL,
    title TEXT NULL,
    subtitle TEXT NULL,
    location_id UUID REFERENCES locations(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TRIGGER
    update_locations_timestamp
    BEFORE UPDATE ON locations FOR EACH ROW EXECUTE PROCEDURE updated_timestamp();
CREATE TRIGGER
    guard_created_at_on_locations
    BEFORE UPDATE ON locations FOR EACH ROW EXECUTE PROCEDURE guard_created_timestamp();

CREATE TRIGGER
    update_items_timestamp
    BEFORE UPDATE ON items FOR EACH ROW EXECUTE PROCEDURE updated_timestamp();
CREATE TRIGGER
    guard_created_at_on_items
    BEFORE UPDATE ON items FOR EACH ROW EXECUTE PROCEDURE guard_created_timestamp();
