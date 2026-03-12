import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer/ui/Footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Header />
        <Footer />
      </main>
    </div>
  );
}
