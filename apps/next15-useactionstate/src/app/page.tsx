import ContactForm from "@/components/form";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <ContactForm />
      </div>
    </div>
  );
}
