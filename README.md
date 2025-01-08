# Documentație Catalog Online

Această documentație oferă o prezentare detaliată a proiectului `Catalog Online`, inclusiv structura sa, funcționalitățile principale și instrucțiunile de instalare și utilizare.

---

## Descriere generală

`Catalog Online` este un sistem pentru gestionarea informațiilor școlare, care permite utilizatorilor (profesori, studenți, administratori) să interacționeze cu datele academice, cum ar fi note, absențe și clase. Proiectul este împărțit în două componente principale:

1. **Client**: Dezvoltat în React, responsabil pentru interfața grafică și interacțiunea utilizatorului.
2. **Server**: Implementat în Spring Boot, oferă un API REST pentru gestionarea datelor și logica aplicației.

---

## Structura Proiectului

### Client

Localizat în directorul `client`, include:

- **Fișiere principale**:
  - `App.js`, `index.js`: Punctele de intrare pentru aplicația React.
  - Fișiere de stil (CSS) și imagini.
- **Pagini**:
  - `LoginPage.jsx`: Pagină de autentificare.
  - `RegisterPage.jsx`: Pagină de înregistrare.
  - `AdminPage.jsx`, `ProfessorPage.jsx`, `StudentPage.jsx`: Pagini dedicate fiecărui tip de utilizator.
- **Utilitare**:
  - `httpClient.js`: Funcții pentru comunicarea cu serverul.
  - Diverse funcții pentru apeluri API și gestionarea sesiunilor utilizatorilor.

### Server

Localizat în directorul `Server`, include:

- **Pachete Java**:
  - `controller`: Controlează logica aplicației și rutele API (ex.: `LoginController.java`, `TeacherController.java`).
  - `dtos`: Obiecte pentru transferul datelor între client și server.
  - `service`: Contine logica principală a aplicației (ex.: `UserService.java`).
  - `repository`: Interacțiune cu baza de date prin intermediul JPA.
  - `model`: Definiții ale entităților (ex.: `User.java`, `Classroom.java`).
  - `security`: Configurare JWT și filtre de securitate.

- **Fișiere esențiale**:
  - `application.properties`: Configurări pentru aplicație (ex.: conexiunea la baza de date PostgreSQL).
  - `pom.xml`: Definiții pentru dependențe și construcția proiectului.

---

## Funcționalități principale

1. **Autentificare și autorizare**:
   - Bazată pe JWT (JSON Web Tokens).
   - Roluri de utilizatori: Admin, Profesor, Student.
2. **Gestionarea claselor**:
   - Crearea, modificarea și ștergerea claselor.
3. **Adăugarea și gestionarea notelor/absențelor**:
   - Profesori pot adăuga note și absențe pentru studenți.
4. **Dashboard personalizat**:
   - Fiecare tip de utilizator are acces la funcționalități specifice rolului său.

---

## Securitatea aplicației

Securitatea este o componentă esențială a aplicației `Catalog Online`, implementată prin:

- **Autentificare bazată pe JWT**:
  - Utilizatorii primesc un token JWT după autentificare, care este utilizat pentru toate cererile ulterioare.
  - Tokenurile sunt validate prin filtre personalizate în Spring Security.
- **Criptarea parolelor**:
  - Parolele utilizatorilor sunt criptate folosind algoritmul BCrypt înainte de stocare în baza de date.
- **Controlul accesului**:
  - API-urile sunt protejate pe baza rolurilor utilizatorilor, garantând accesul la resurse doar celor autorizați.
- **CORS și securitatea cererilor**:
  - Configurații personalizate pentru a permite doar cererile din surse de încredere.

---

## Instrucțiuni de instalare

### Cerințe preliminare

- Node.js și npm instalate pentru client.
- JDK 11+ instalat pentru server.
- PostgreSQL pentru baza de date.

### Instalare client

1. Navigați în directorul `client`:
   ```bash
   cd client
   ```
2. Instalați dependențele:
   ```bash
   npm install
   ```
3. Porniți aplicația:
   ```bash
   npm start
   ```

### Instalare server

1. Navigați în directorul `Server`:
   ```bash
   cd Server
   ```
2. Configurați baza de date PostgreSQL în `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/catalog_online
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```
3. Construiți și rulați aplicația:
   ```bash
   ./mvnw spring-boot:run
   ```

---

## Utilizare

1. Accesați aplicația la `http://localhost:3000` pentru client.
2. Autentificați-vă cu un cont existent sau creați unul nou.
3. Utilizați dashboard-ul pentru a accesa funcționalitățile corespunzătoare.

---

## Contribuție

Pentru a contribui la proiect:
1. Faceți un fork al depozitului.
2. Creați o ramură nouă:
   ```bash
   git checkout -b feature-xyz
   ```
3. Faceți modificările dorite și trimiteți un pull request.

---


