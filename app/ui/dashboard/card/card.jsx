import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "./card.module.css";

const Card = () => {
  return (
    <div className={styles.container}>
      <MdSupervisedUserCircle size={24}/>
      <div className={styles.texts}>
        <span className={styles.title}>Total users</span>
        <span className={styles.number}>10.273</span>
        <span className={styles.details}>
          <span className={styles.positive}>20% </span>more than 20% people
        </span>
      </div>
    </div>
  );
};

export default Card;
