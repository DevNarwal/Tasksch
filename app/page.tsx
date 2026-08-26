import Image from "next/image";
import {Button} from "@/components/ui/button"
export default function Home() {
  return (
     <div className ="flex flex-row gap-4">
      <Button variant="default">Click me </Button>
      <Button variant="destructive">Click me </Button>
      <Button variant="outline">Click me </Button>
      <Button variant="secondary">Click me </Button>
     </div>
     
  );
}
