# Bookly

Kitaplarınızı yükleyebileceğiniz, kütüphane olarak yönetebileceğiniz ve kitaplarla sesli/ metin tabanlı AI sohbeti kurabileceğiniz bir web uygulamasıdır.

**Canlı demo:** [https://bookly-steel.vercel.app/](https://bookly-steel.vercel.app/)

---

## Uygulama Amacı

Bookly, kişisel kitap kütüphanenizi tek yerde toplamanızı ve kitaplarınızla etkileşim kurmanızı sağlar:

- **PDF yükleme:** Kitaplarınızı PDF olarak yükleyip kütüphanenize ekleyebilirsiniz.
- **Kütüphane:** Tüm kitaplarınızı liste halinde görüntüleyip kitap detay sayfalarına gidebilirsiniz.
- **AI ile sohbet:** Her kitap için AI asistanıyla sesli veya metin tabanlı sohbet ederek kitap hakkında soru sorabilir, özet ve içgörü alabilirsiniz.


---

## Kullandığım Teknolojiler

| Alan | Teknoloji |
|------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS 4, Radix UI, shadcn, Lucide ikonlar |
| **Form & validasyon** | React Hook Form, Zod |
| **Kimlik doğrulama** | Clerk |
| **Veritabanı** | MongoDB, Mongoose |
| **Dosya depolama** | Vercel Blob |
| **AI sohbet** | Groq API (Llama modeli) |
| **PDF işleme** | pdfjs-dist |
| **Diğer** | Sonner (toast), class-variance-authority, clsx, tailwind-merge |

---

## Neden Bu Teknolojiler?

- **Next.js (App Router):** Server ve client bileşenleri, API route’lar ve kolay deploy (Vercel) için. App Router ile layout’lar, server component’lar ve streaming ile modern bir yapı kuruldu.
- **Clerk:** Kullanıcı kayıt/giriş, modal veya tam sayfa sign-in ve güvenli session yönetimi hazır çözüm olarak kullanıldı.
- **MongoDB + Mongoose:** Kitap ve segment gibi dokümanlar için esnek şema, hızlı geliştirme ve Vercel/Atlas entegrasyonu için uygun.
- **Vercel Blob:** PDF ve kapak görselleri için sunucuya bağımlılık olmadan, ölçeklenebilir ve hızlı dosya depolama.
- **Groq API:** Kitap bağlamında kısa, hızlı yanıtlar ve sesli sohbet için düşük gecikmeli LLM (Llama) kullanımı.
- **Tailwind + shadcn + Radix:** Tutarlı tasarım sistemi, erişilebilir bileşenler ve hızlı arayüz geliştirme.
- **React Hook Form + Zod:** Form state yönetimi ve tip güvenli validasyon ile daha az hata ve temiz kod.

---

## Repoyu Klonlama ve Çalıştırma

### Gereksinimler

- Node.js 18+
- npm, yarn, pnpm veya bun

### Adımlar

1. **Repoyu klonlayın:**

```bash
git clone https://github.com/KULLANICI_ADI/bookly.git
cd bookly
```

2. **Bağımlılıkları yükleyin:**

```bash
npm install
```

3. **Ortam değişkenlerini ayarlayın:**

Proje kökünde `.env.local` dosyası oluşturun ve aşağıdakileri doldurun:

```env
# Clerk (https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# MongoDB (örn. MongoDB Atlas)
MONGODB_URI=mongodb+srv://...

# Groq API (https://console.groq.com) – kitap sohbeti için
BOOKLY_API_KEY=gsk_...

# Vercel Blob (Vercel projesinde Storage > Blob açın, token oluşturun)
# Upload için gerekli (yerel geliştirmede Vercel Blob token’ı kullanılabilir)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

Clerk için sign-in sayfası kullanıyorsanız (opsiyonel):

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
```

4. **Geliştirme sunucusunu başlatın:**

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

5. **Production build (isteğe bağlı):**

```bash
npm run build
npm start
```

---

## Proje Yapısı (Özet)

- `app/` – Next.js App Router: sayfalar, layout’lar, API route’lar
- `app/(root)/` – Ana sayfa, kitaplar, sign-in
- `app/api/` – Chat ve upload API’leri
- `components/` – Navbar, BookCard, BookVoiceChat, formlar vb.
- `database/` – Mongoose modelleri ve bağlantı
- `lib/` – Actions, sabitler, yardımcılar

---

## Deploy

Uygulama [Vercel](https://vercel.com) üzerinde deploy edilmiştir.

- **Canlı link:** [https://bookly-steel.vercel.app/](https://bookly-steel.vercel.app/)

Kendi Vercel projenizde deploy etmek için:

1. Repoyu GitHub’a push edin.
2. [Vercel](https://vercel.com/new) üzerinden “Import Project” ile repoyu seçin.
3. Yukarıdaki ortam değişkenlerini Vercel proje ayarlarına ekleyin.
4. Vercel Blob storage’ı projede açıp `BLOB_READ_WRITE_TOKEN` değerini ekleyin.
5. Deploy’a tıklayın.
