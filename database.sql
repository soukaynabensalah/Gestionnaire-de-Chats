-- Database Schema for Railway MySQL
-- Gestionnaire de Chats Application

-- Create the cats table
CREATE TABLE IF NOT EXISTS cats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tag VARCHAR(100),
    description TEXT,
    img VARCHAR(255) DEFAULT 'catDefault.jpeg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    pwd VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional: Insert sample data for testing
INSERT INTO cats (name, tag, description, img) VALUES
('Minou', 'Persan', 'Un chat persan très élégant avec un pelage doux', 'cat1.jpg'),
('Felix', 'Siamois', 'Chat siamois joueur et affectueux', 'cat2.jpg'),
('Luna', 'Maine Coon', 'Grande et majestueuse, Luna adore les câlins', 'cat3.jpg'),
('Simba', 'Bengal', 'Chat bengal énergique avec de belles marques', 'cat4.jpg'),
('Nala', 'British Shorthair', 'Chat britannique calme et doux', 'cat5.jpg'),
('Whiskers', 'Ragdoll', 'Chat ragdoll très détendu et sociable', 'cat6.jpg');
