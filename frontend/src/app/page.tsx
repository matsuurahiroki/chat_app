import Card from "./components/card";

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white ">
      <div className="z-8 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Card/>
      </div>
    </main>
  );
}

export default Home;