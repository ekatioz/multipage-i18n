import classes from "./link.module.scss";

interface LinkProps {
  caption: string;
}

function Link(props: LinkProps) {
  return (
    <a href="#" className={classes.link}>
      {props.caption}
    </a>
  );
}

export default Link;
