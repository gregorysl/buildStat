import React, { useState, useEffect } from "react";
import { getFoldersData } from "./api/buildsUrls";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import BuildPage from "./components/BuildPage";
import SearchPage from "./components/SearchPage";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState([]);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const data = await getFoldersData();
      setFolders(data.value);
    };

    fetchData();
    setLoading(false);
  }, []);

  const routes = folders.map((folder) => {
    let link = folder.path.replace(/[\\]/g, "/");
    return (
      <Route
        exact
        key={link}
        path={link}
        component={() => <BuildPage path={folder.path} />}
      />
    );
  });
  return (
    <div className="App">
      <div>{loading && "Loading..."}</div>
      <Router>
        <Switch>
          <Route
            path="/"
            exact
            component={() => <SearchPage folders={folders} />}
          />
          {routes}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
