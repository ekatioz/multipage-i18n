import classes from "./headline.module.scss";

interface HeadlineProps {
  caption: string;
}

function Headline(props: HeadlineProps) {
  return <h1 className={classes.headline}>{props.caption}</h1>;
}

export default Headline;
