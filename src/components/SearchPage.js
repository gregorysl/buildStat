import React, { useState, useEffect } from "react";
// import { Input, Tree } from "antd";
import { Link } from "react-router-dom";
import groupBy from "../helpers/groupBy";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

// const { TreeNode, DirectoryTree } = Tree;

const treeData = (data, acc = "") => {
  var all = groupBy(data, 0);
  return Object.keys(all).map((x) => {
    const path = `${acc}/${x}`;
    const childrenArray = all[x]
      .map((x) => x.slice(1))
      .filter((x) => x.length !== 0);
    const hasChildren = childrenArray.length > 0;
    const children = hasChildren ? treeData(childrenArray, path) : [];
    return createTreeData(x, !hasChildren, path, children);
  });
};
const createTreeData = (name, leaf, path, children) => ({
  name,
  leaf,
  path,
  children,
});

// const generateNodeElement = (nodes) =>
//   nodes.map((node) => {
//     const ch =
//       node.children.length > 0 ? generateNodeElement(node.children) : null;
//     return (
//       <TreeNode
//         key={node.path}
//         title={<Link to={node.path}>{node.name}</Link>}
//         isLeaf={node.leaf}
//       >
//         {ch}
//       </TreeNode>
//     );
//   });
const generateNodeElement2 = (nodes) =>
  nodes.map((node) => {
    const ch =
      node.children.length > 0 ? generateNodeElement2(node.children) : null;
    return (
      <TreeItem
        key={node.path}
        nodeId={node.path}
        label={<Link to={node.path}>{node.name}</Link>}
        // label={node.name}
      >
        {ch}
      </TreeItem>
    );
  });

const SearchPage = (props) => {
  const [search, setSearc] = useState("");
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const data = props.folders
      .filter((folder) => folder.path !== "\\")
      .map((x) => x.path.replace("\\", "").replace(/[\\]/g, "/"));
    setFolders(data);
  }, [props.folders]);
  const handleChange = (event) => {
    setSearc(event.target.value);
  };

  if (folders.length === 0) {
    return <h1>No data</h1>;
  }
  console.log(folders);
  let data = null;
  if (search !== "") {
    data = folders
      .filter((x) => x.toLowerCase().indexOf(search) !== -1)
      .map((x) => createTreeData(x, true, x, []));
  } else {
    data = treeData(folders.map((x) => x.split("/")));
  }
  console.log(data);
  // const treeNodes = generateNodeElement(data);
  const treeNodes2 = generateNodeElement2(data);
  const newTN = folders.map((x) => <TreeItem key={x} nodeId={x} label={x} />);
  return (
    <div className="certain-category-search-wrapper" style={{ width: 300 }}>
      <TreeView
        defaultExpanded={["Support"]}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {treeNodes2}
      </TreeView>
      {/* <Input
        // suffix={<Icon type="search" className="certain-category-icon" />}
        style={{ width: 300, padding: 10 }}
        placeholder="input search"
        value={search}
        onChange={(event) => this.handleChange(event)}
      /> */}
      {/* <DirectoryTree defaultExpandAll style={{ top: 10 }}>
        {treeNodes}
      </DirectoryTree> */}
    </div>
  );
};

export default SearchPage;
