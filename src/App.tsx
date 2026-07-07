import { Route, BrowserRouter, Routes } from "react-router-dom";
import { RootLayout } from "./layouts/rootLayout";
import { Home } from "./routes/Home";
import { About } from "./routes/About";
import { Services } from "./routes/Services";
import { Projects } from "./routes/Projects";
import { Pricing } from "./routes/Pricing";
import { Contact } from "./routes/Contact";
import { LiveChatBubble } from "./features/live-chat";

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </RootLayout>
      <LiveChatBubble />
    </BrowserRouter>
  );
}

export default App;
