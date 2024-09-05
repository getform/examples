"use client";

import { useState, useActionState, useEffect } from "react";
import { submitForm } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRef } from "react";

const contactTypes = [
  { value: "Problem", label: "❗ Problem" },
  { value: "Question", label: "❓ Question" },
  { value: "Feedback", label: "💬 Feedback" },
];

export default function ContactForm() {
  const [state, action, isPending] = useActionState(submitForm, null);
  const [selectedType, setSelectedType] = useState("Problem");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const names = Array.from(files).map((file) => file.name);
      setFileNames(names);
    } else {
      setFileNames([]);
    }
  };

  useEffect(() => {
    if (state?.success) {
      setFileNames([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [state?.success]);

  return (
    <div className=" flex items-center justify-center text-slate-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-gray-600 mb-2">
          <a
            href="https://getform.io?ref=next15-useactionstate"
            target="_blank"
            className="text-blue-600 hover:text-blue-800"
          >
            Visit Getform to get your own form ID.
          </a>
        </p>
        <h2 className="text-2xl font-bold mb-2">Contact us</h2>
        <p className="text-gray-600 mb-6">
          What is the issue? If you're reporting a bug, what are the steps you
          took so we can reproduce the behaviour?
        </p>
        <form action={action} className="space-y-4">
          <RadioGroup
            defaultValue="Problem"
            onValueChange={(value) => setSelectedType(value)}
            className="flex space-x-4"
          >
            {contactTypes.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={value} />
                <Label htmlFor={value}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
          <input type="hidden" name="type" value={selectedType} />
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Your name"
              required
            />
            {state?.errors?.name && (
              <p className="text-red-500 text-sm">{state.errors.name[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Your email"
              required
            />
            {state?.errors?.email && (
              <p className="text-red-500 text-sm">{state.errors.email[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Write your message here..."
              required
            />
            {state?.errors?.message && (
              <p className="text-red-500 text-sm">{state.errors.message[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-800"
            >
              Attach images, files or videos
            </Label>
            <Input
              id="file-upload"
              name="file[]"
              type="file"
              multiple={true}
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            {fileNames.length > 0 && (
              <div className="text-sm text-gray-600 mt-1">
                <p>Selected files:</p>
                <ul className="list-disc pl-5">
                  {fileNames.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Sending..." : "Send message"}
          </Button>
        </form>

        {state?.success && (
          <Alert variant="default" className="mt-4">
            <AlertTitle>Thank you, {state.formValues?.name}!</AlertTitle>
            <AlertDescription>Form submitted successfully!</AlertDescription>
          </Alert>
        )}
        {state?.errors?.form && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{state.errors.form[0]}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
