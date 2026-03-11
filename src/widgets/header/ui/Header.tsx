import styles from './Header.module.scss';
import Link from "next/link";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/">
          Logo
        </Link>

        <Link href="/">
          +7 (4012) 99-44-99
        </Link>

        <button>
          Menu
        </button>
      </div>
    </header>
  );
};