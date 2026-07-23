# אליפות פגאסוס - תחרות הנקודות השנתית

אתר לניהול תחרות הנקודות השנתית של פגאסוס מואי תאי. מתאמנים נרשמים, אוהד
מאשר אותם ומעניק נקודות על משימות בזירה, וכולם רואים לוח מובילים חי.

הפרויקט בנוי ב-React + Vite + Tailwind, עם Firebase (Authentication +
Firestore) לניהול חשבונות ושמירת נתונים - כי GitHub Pages הוא אחסון סטטי
בלבד ולא יכול "לזכור" משתמשים ונקודות בעצמו.

---

## שלב 1: הקמת Firebase (חינמי)

1. גשו ל-https://console.firebase.google.com והתחברו עם חשבון Google.
2. **Add project** → תנו שם (למשל `pegasus-competition`) → אין צורך ב-Google
   Analytics, אפשר לכבות → **Create project**.
3. במסך הראשי של הפרויקט, לחצו על סמל ה-**`</>`** (Web app) כדי לרשום אפליקציית
   ווב. תנו לה שם ולחצו **Register app**.
4. תקבלו קטע קוד עם אובייקט `firebaseConfig` - העתיקו את הערכים (apiKey,
   authDomain, projectId וכו') לתוך הקובץ `src/firebase.ts` בפרויקט, במקום
   הערכים `"REPLACE_ME"`.
5. בתפריט הצד: **Build → Authentication → Get started → Sign-in method** →
   הפעילו **Email/Password**.
6. בתפריט הצד: **Build → Firestore Database → Create database** → בחרו מיקום
   (למשל `eur3` אם אתם באירופה/ישראל) → מצב **Production**.
7. בטאב **Rules** של Firestore, מחקו את מה שיש שם והדביקו את התוכן של הקובץ
   `firestore.rules` מהפרויקט הזה, ואז **Publish**.

## שלב 2: יצירת חשבון המאסטר של אוהד

1. העלו את האתר (ראו שלב 3) או הריצו אותו מקומית עם `npm run dev`.
2. היכנסו לעמוד **הצטרפות לתחרות** ורשמו את אוהד כמו כל מתאמן רגיל (שם,
   אימייל, סיסמה).
3. ב-Firebase Console → **Firestore Database → Data**, פתחו את
   האוסף `users` ומצאו את המסמך של אוהד (לפי האימייל).
4. ערכו את המסמך ידנית: שנו את השדה `role` מ-`"trainee"` ל-`"admin"`, ואת
   השדה `status` ל-`"approved"`.
5. אוהד יתחבר מחדש (או ירענן) ויראה את קישור **"ניהול"** בתפריט העליון.

זהו צעד חד-פעמי. מכאן, אוהד עצמו מאשר כל מתאמן חדש דרך פאנל הניהול, ואין
צורך לגעת שוב ב-Firebase Console לצורך זה.

## שלב 3: העלאה ל-GitHub Pages

### 3א. יצירת הריפו
1. צרו ריפו חדש בשם `pegasus-competition` (או כל שם אחר) ב-GitHub.
2. אם בחרתם שם אחר, עדכנו את `base` בקובץ `vite.config.ts` ואת ה-`basename`
   ב-`src/main.tsx` לאותו שם (למשל `/my-repo-name/`).
3. העלו את כל הקבצים של הפרויקט לריפו (`git init`, `git add .`,
   `git commit -m "init"`, `git remote add origin <כתובת הריפו>`,
   `git push -u origin main`).

### 3ב. הפעלת הפריסה האוטומטית
1. בריפו ב-GitHub: **Settings → Pages**.
2. תחת **Build and deployment → Source**, בחרו **GitHub Actions**.
3. זהו! בכל `push` ל-`main`, ה-workflow שכבר נמצא בפרויקט
   (`.github/workflows/deploy.yml`) יבנה ויפרסם את האתר אוטומטית.
   האתר יהיה זמין בכתובת `https://<שם-המשתמש-שלכם>.github.io/pegasus-competition/`.

> חלופה ידנית: אפשר גם להריץ `npm run deploy` מהמחשב בכל פעם שרוצים לפרסם
> עדכון (זה משתמש בחבילת `gh-pages` שכבר מותקנת בפרויקט).

## שלב 4: הוספת המשימות הראשונות

היכנסו כאוהד → **ניהול → ניהול משימות**, וצרו את רשימת הקריטריונים
הראשונית (למשל הדוגמאות שכבר מוצגות באתר: הכי הרבה מרפקים בניצחון, הכי
הרבה בעיטות בסיבוב, נוקאאוט ממכה לכבד וכו') עם כמות הנקודות המתאימה לכל
אחת. אפשר להוסיף, לערוך, להשבית או למחוק משימות בכל שלב.

---

## פיתוח מקומי

```bash
npm install
npm run dev
```

## מבנה הפרויקט

- `src/pages` - העמודים (נחיתה, התחברות, הרשמה, לוח מובילים, משימות, פרופיל,
  פאנל ניהול)
- `src/components/admin` - שלוש הלשוניות של פאנל הניהול
- `src/context/AuthContext.tsx` - ניהול המשתמש המחובר והפרופיל שלו
- `src/firebase.ts` - חיבור ל-Firebase (כאן מדביקים את המפתחות)
- `firestore.rules` - כללי האבטחה של בסיס הנתונים
