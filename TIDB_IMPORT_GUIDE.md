# 📥 Importer vos données dans TiDB Cloud

Si vous voyez une page vide (pas de chats), c'est parce que votre base de données dans le cloud est vide ! Vous devez y créer la table `cats` et ajouter les données.

## Comment faire ?

1.  Connectez-vous à [TiDB Cloud](https://tidbcloud.com/).
2.  Allez dans votre cluster.
3.  Cliquez sur l'onglet **"Chat2Query"** (ou "SQL Editor" sur la gauche).
4.  Copiez tout le contenu du fichier SQL ci-dessous :

```sql
-- Crée la table
CREATE TABLE IF NOT EXISTS cats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tag VARCHAR(100),
    description TEXT,
    img VARCHAR(255) DEFAULT 'catDefault.jpeg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ajoute des chats exemples
INSERT INTO cats (name, tag, description, img) VALUES
('Minou', 'Persan', 'Un chat persan très élégant avec un pelage doux', 'cat1.jpg'),
('Felix', 'Siamois', 'Chat siamois joueur et affectueux', 'cat2.jpg'),
('Luna', 'Maine Coon', 'Grande et majestueuse, Luna adore les câlins', 'cat3.jpg'),
('Simba', 'Bengal', 'Chat bengal énergique avec de belles marques', 'cat4.jpg'),
('Nala', 'British Shorthair', 'Chat britannique calme et doux', 'cat5.jpg'),
('Whiskers', 'Ragdoll', 'Chat ragdoll très détendu et sociable', 'cat6.jpg');
```

5.  Collez ce code dans l'éditeur de TiDB Cloud.
6.  Cliquez sur le bouton **"Run"** (ou le triangle de lecture ▶️).

Une fois que vous voyez "Success", retournez sur votre site Vercel et actualisez la page. Vos chats devraient apparaître ! 🐱
