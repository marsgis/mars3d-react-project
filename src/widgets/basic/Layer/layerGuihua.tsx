 import styles from "./index.module.less"
import image from "./img/guihua.jpg"

export default function (props) {

  return (
    <div className={`${styles["layer-pictrue"]}`}>
      <img className={`${styles["layer-picture_img"]}`} alt="" src={image} />
    </div>
  )
}
