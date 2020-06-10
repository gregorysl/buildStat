import React from "react";
import { Input, Icon, Tree } from "antd";
import { Link } from "react-router-dom";
import groupBy from "../helpers/groupBy";

const { TreeNode, DirectoryTree } = Tree;

const treeData = (data, acc = "") => {
  var all = groupBy(data, 0);
  return Object.keys(all).map(x => {
    const path = `${acc}/${x}`;
    const childrenArray = all[x]
      .map(x => x.slice(1))
      .filter(x => x.length !== 0);
    const hasChildren = childrenArray.length > 0;
    const children = hasChildren ? treeData(childrenArray, path) : [];
    return createTreeData(x, !hasChildren, path, children);
  });
};
const createTreeData = (name, leaf, path, children) => ({
  name,
  leaf,
  path,
  children
});

const generateNodeElement = nodes =>
  nodes.map(node => {
    const ch =
      node.children.length > 0 ? generateNodeElement(node.children) : null;
    return (
      <TreeNode
        key={node.path}
        title={<Link to={node.path}>{node.name}</Link>}
        isLeaf={node.leaf}
      >
        {ch}
      </TreeNode>
    );
  });

class SearchPage extends React.Component {
  constructor() {
    super();
    this.state = {
      search: "",
      folders: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      folders: this.props.folders
        .filter(folder => folder.path !== "\\")
        .map(x => x.path.replace("\\", "").replace(/[\\]/g, "/"))
    });
  }

  handleChange(event) {
    this.setState({ search: event.target.value });
  }

  render() {
    if (this.state.folders.length === 0) {
      return <h1>No data</h1>;
    }
    let data = null;
    if (this.state.search !== "") {
      data = this.state.folders
        .filter(x => x.toLowerCase().indexOf(this.state.search) !== -1)
        .map(x => createTreeData(x, true, x, []));
    } else {
      data = treeData(this.state.folders.map(x => x.split("/")));
    }
    const treeNodes = generateNodeElement(data);
    return (
      <div className='certain-category-search-wrapper' style={{ width: 300 }}>
        <Input
          suffix={<Icon type='search' className='certain-category-icon' />}
          style={{ width: 300, padding: 10 }}
          placeholder='input search'
          value={this.state.search}
          onChange={event => this.handleChange(event)}
        />
        <DirectoryTree defaultExpandAll style={{ top: 10 }}>
          {treeNodes}
        </DirectoryTree>
      </div>
    );
  }
}

export default SearchPage;
