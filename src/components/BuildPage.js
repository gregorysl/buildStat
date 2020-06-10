import React from "react";
import {
  getBuildsDataFromPath,
  getBuildsDataByDefinition,
} from "../api/buildsUrls";
import { formatDistance } from "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  root: { margin: 5 },
  root1: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  cardHeader: {
    color: "black",
  },
  avatar: {
    backgroundColor: "white",
    color: "black",
  },
}));

const ImageGridList = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={2} spacing={5}>
        {props.arr.map((build) => {
          const definitionLink = props.definitionsData
            .filter((definition) => definition.id === build.definition.id)
            .map((definition) => definition._links.web.href);
          return (
            <GridListTile key={build.id} cols={1}>
              <MediaCard
                id={build.id}
                build={build}
                definitionLink={definitionLink}
              />
            </GridListTile>
          );
        })}
      </GridList>
    </div>
  );
};
const MediaCard = ({ definitionLink, build }) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.root1}
      style={{
        backgroundColor:
          build.status === "completed"
            ? build.result === "succeeded"
              ? "#27b37680"
              : "#F2493080"
            : "#6cc0e580",
      }}
    >
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {build.status === "completed"
              ? "✔"
              : build.status === "inProgress"
              ? "⌛"
              : "❌"}
          </Avatar>
        }
        title={
          <a className={classes.cardHeader} href={definitionLink}>
            {build.definition.name}
          </a>
        }
        subheader={
          <a className={classes.cardHeader} href={build._links.web.href}>
            {build.buildNumber}
          </a>
        }
      />
      <CardContent>
        <Typography variant="body2" component="p">
          status: {build.status}{" "}
          {build.status === "completed" &&
            formatDistance(new Date(), new Date(build.finishTime)) + " ago"}
        </Typography>
      </CardContent>
    </Card>
  );
};
class BuildPage extends React.Component {
  constructor() {
    super();
    this.state = {
      definitionsData: [],
      buildsData: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    getBuildsDataFromPath(this.props.path).then((data) => {
      this.setState({ definitionsData: data.value }, () => {
        const definitionIds = this.state.definitionsData.map(
          (definition) => definition.id
        );

        getBuildsDataByDefinition(definitionIds.join(",")).then((data) => {
          this.setState({ buildsData: data.value, loading: false });
        });
      });
    });
  }

  componentWillUnmount() {
    this.setState({ definitionsData: [], buildsData: [], loading: false });
  }

  render() {
    const builds1 = (
      <ImageGridList
        arr={this.state.buildsData}
        definitionsData={this.state.definitionsData}
      />
    );
    return (
      <div>
        <h1>{this.props.path}</h1>
        {builds1}
      </div>
    );
    // const builds = this.state.buildsData.map((build) => {
    //   const definitionLink = this.state.definitionsData
    //     .filter((definition) => definition.id === build.definition.id)
    //     .map((definition) => definition._links.web.href);

    // return (
    //     <MediaCard
    //       key={build.id}
    //       build={build}
    //       definitionLink={definitionLink}
    //     />
    // <div key={build.id}>
    //   <div
    //     style={{
    //       color:
    //         build.status === "completed"
    //           ? build.result === "succeeded"
    //             ? "green"
    //             : "red"
    //           : "blue",
    //     }}
    //   >
    //     <a href={definitionLink}>{build.definition.name}</a>(
    //     <a href={build._links.web.href}>{build.buildNumber}</a>)
    //   </div>
    //   <div>
    //     status: {build.status}{" "}
    //     {build.status === "completed" &&
    //       formatDistance(new Date(), new Date(build.finishTime)) + " ago"}
    //   </div>
    //   {build.status === "completed" && <div>result: {build.result}</div>}
    //   <br />
    //     // </div>
    //   );
    // });
  }
}

export default BuildPage;
