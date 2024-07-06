import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { deleteNode, getTree } from "./api/interceptor";
import Tree from "react-d3-tree";

const containerStyles = {
  width: "100%",
  height: "100vh",
};

const linkStyle = {
  stroke: "red",
  strokeWidth: 2,
};

const Home = () => {
  const [tree, setTree] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const convertToTreeData = (data) => {
    const convertNode = (node, depth = 0) => {
      const { name, email, children, _id } = node;

      const colors = ["#FF6347", "#FF7F50", "#FFD700", "#ADFF2F", "#7FFF00"];
      const color = colors[depth % colors.length];

      const treeNode = {
        name: name,
        attributes: {
          Email: email,
          id: _id,
        },
        nodeSvgShape: {
          shape: "circle",
          shapeProps: {
            r: 10,
            fill: color,
          },
        },
        children: children.map((child) => convertNode(child, depth + 1)),
      };

      return treeNode;
    };

    return data.map((node) => convertNode(node));
  };

  const fetchData = async () => {
    try {
      const data = await getTree();
      const tree = convertToTreeData(data?.tree);
      setTree(tree);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      console.log("selectedNode", selectedNode.attributes.id);
      await deleteNode(selectedNode.attributes.id);
      setOpen(false);
      setSelectedNode(null);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNodeClick = (nodeData) => {
    setSelectedNode(nodeData.data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNode(null);
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "20px",
          rowGap: "20px",
          columnGap: "10px",
        }}
      >
        <div style={containerStyles}>
          {tree.length > 0 && (
            <Tree
              data={tree}
              orientation="vertical"
              styles={{ links: linkStyle }}
              onNodeClick={handleNodeClick}
              separation={{ siblings: 2, nonSiblings: 2 }}
            />
          )}
        </div>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Node Details</DialogTitle>
        {selectedNode && (
          <DialogContent>
            <DialogContentText>
              <strong>Name:</strong> {selectedNode.name} <br />
              <strong>Email:</strong> {selectedNode.attributes.Email} <br />
              {selectedNode.attributes.RefferalToken} <br />
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;
