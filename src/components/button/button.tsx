import classes from "./button.module.scss";

interface ButtonProps {
  caption: string;
}

function Button(props: ButtonProps) {
  return <button className={classes.button}>{props.caption}</button>;
}

export default Button;
