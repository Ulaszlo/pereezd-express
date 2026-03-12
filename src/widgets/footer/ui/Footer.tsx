import {FC} from "react";
import styles from "./Footer.module.scss"

interface IFooter {
  className?: string;
}

export const Footer: FC<IFooter> = ({className}) => {
  return (
    <footer className={styles.container}>

    </footer>
  );
};
