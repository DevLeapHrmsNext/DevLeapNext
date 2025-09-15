import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { EmployeeORGHierarchyDataModel } from "../models/OrgHierarchyDataModel";
import { getImageApiURL, staticIconsBaseURL } from "../pro_utils/stringConstants";

const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

type TreeNode = any; // You can type this better if you wish

const OrganizationTree = ({
  employeeHerarichy,
}: {
  employeeHerarichy: EmployeeORGHierarchyDataModel[];
}) => {
  const treeContainer = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [rawTreeData, setRawTreeData] = useState<any | null>(null); // full API-style tree with collapse flags
  const [treeData, setTreeData] = useState<TreeNode | null>(null); 
  const [treeKey, setTreeKey] = useState(0);

  // Convert API data to tree node structure
  const convertToTreeNode = (employee: any, path: string): TreeNode => {
    const isCollapsed = employee.collapsed ?? true;
    return {
      name: employee.name,
      emp_id: employee.emp_id,
      profile_pic: employee.profile_pic,
      leap_client_designations: employee.leap_client_designations,
      leap_client_departments: employee.leap_client_departments,
      nodePath: path,
      collapsed: isCollapsed,
      bg_color: employee.bg_color,
      hasChildren: employee.hasChildren,
      children:
        isCollapsed || !employee.children
          ? []
          : employee.children.map((child: any, idx: number) =>
              convertToTreeNode(child, `${path}.${idx}`)
            ),
    };
  };
  

  const applyCollapseRules = (node: TreeNode, path: string): TreeNode => ({
    ...node,
    nodePath: path,
    children: node.collapsed
      ? []
      : (node.children || []).map((child: TreeNode, idx: number) =>
          applyCollapseRules(child, `${path}.${idx}`)
        ),
  });

  // Find a node by path and return reference
  const findNodeByPath = (node: TreeNode, pathParts: string[]): TreeNode => {
    let current = node;
    for (const idx of pathParts) {
      if (!current.children || !current.children[parseInt(idx, 10)]) break;
      current = current.children[parseInt(idx, 10)];
    }
    return current;
  };

  // Initial tree setup: expand root and its immediate children, collapse deeper levels
  useEffect(() => {
    if (treeContainer.current) {
      const { width, height } = treeContainer.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  
    if (employeeHerarichy && employeeHerarichy.length > 0) {
      const root = structuredClone(employeeHerarichy[0]);
  
      // Default: expand root & children
      root.collapsed = false;
      root.bg_color = "#f8d7d8";
      root.children?.forEach((child: any) => {
        child.collapsed = true;
        child.bg_color ="#c5f4c8";

        if (child.children.length>0){
          child.hasChildren =true;
        }else{
          child.hasChildren = false;
        }
        child.children?.forEach((g: any) => {
          g.bg_color = "#fafcba";
          g.collapsed = true;
          if (g.children.length > 0) {
            g.hasChildren = true;
          }else{
            g.hasChildren = false;
          }
          g.children?.forEach((greatgrand: any) => {
            greatgrand.bg_color = "#f8f3d7"
          })
          
      });
      });
  
      setRawTreeData(root);
      setTreeData(convertToTreeNode(root, "0")); // generate renderable tree
    }
  }, [employeeHerarichy]);



  const handleNodeClick = (nodeDatum: TreeNode) => {
    if (!nodeDatum.nodePath) return;
    console.log(nodeDatum);
    
    const pathParts = nodeDatum.nodePath.split(".");
    const targetIndex = parseInt(pathParts[pathParts.length - 1], 10);
    const parentPath = pathParts.slice(1, -1);
  
    const updatedRaw = structuredClone(rawTreeData);
    const parentNode =
      parentPath.length === 0 ? updatedRaw : findNodeByPath(updatedRaw, parentPath);
  
    if (parentNode.children) {
      const clickedNode = parentNode.children[targetIndex];
      const willExpand = clickedNode.collapsed;
  
      // Collapse all siblings
      parentNode.children.forEach((child: TreeNode) => {
        child.collapsed = true;
      });
  
      // Toggle clicked
      clickedNode.collapsed = !willExpand;
    }
  
    setRawTreeData(updatedRaw);
    setTreeData(convertToTreeNode(updatedRaw, "0"));
    setTreeKey(prev => prev + 1); // trigger re-render
  };
  
  

const truncateText = (str: string, maxLen: number) =>
  str?.length > maxLen ? str.slice(0, maxLen) + "…" : str;
  // Custom node rendering
  const renderCustomNode = ({ nodeDatum }: any) => {
    const imageURL = nodeDatum?.profile_pic
      ? getImageApiURL +"/uploads/"+ nodeDatum.profile_pic
      : staticIconsBaseURL + "/images/user/user.png";
   

    return (
      <g
        onClick={() => handleNodeClick(nodeDatum)}
        style={{ cursor: "pointer" }}
      >
        <rect
          width="280"
          height="100"
          x={-140}
          y={-50}
          rx={30}
          fill={nodeDatum.bg_color || "#ff0000"}
          stroke={
            nodeDatum.hasChildren
              ? "#9f9f9f"
              : "#9f9f9f"
          }
          strokeWidth={
            nodeDatum.hasChildren
              ? 1
              : 1
          }
          className="whitebox"
        />

        <image
          href={imageURL}
          onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = staticIconsBaseURL + "/images/user/user.png"; }}
          x={-180}
          y={-40}
          width="70"
          height="70"
          style={{ pointerEvents: "none" }}
          clipPath="circle(90px at center)"
        />

        <text
          x={0}
          y={-20}
          textAnchor="middle"
          fill="#000"          
          className="orgchart-name"
          style={{ pointerEvents: "none" }}
        >
          {truncateText(nodeDatum.name, 20)}
          
        </text>

        <text
          x={0}
          y={0}
          textAnchor="middle"
          className="emp_id_box"
          style={{ pointerEvents: "none" }}
        >
          Employee ID:{" "}
          <tspan className="emp_id_text"> 
            {/* {nodeDatum.bg_color} */}
            {nodeDatum.emp_id?.length > 0 ? nodeDatum.emp_id : "--"}
          </tspan>
        </text>

        <text
          x={0}
          y={18}
          textAnchor="middle"
          className="department_box"
          style={{ pointerEvents: "none" }}
        >
          Department:{" "}
          <tspan className="department_text">
            {nodeDatum?.leap_client_departments?.department_name ?? "--"}
          </tspan>
        </text>

        <text
          x={0}
          y={35}
          textAnchor="middle"
          className="designation_box"
          style={{ pointerEvents: "none" }}
        >
          Designation:{" "}
          <tspan className="designation_text">
            
            {nodeDatum?.leap_client_designations && nodeDatum?.leap_client_designations?.designation_name ? truncateText(nodeDatum?.leap_client_designations?.designation_name, 20): "--"}
          </tspan>
        </text>
          
      </g>
    );
  };

  return (
    <div style={{ width: "100%", height: "100vh" }} ref={treeContainer}>
      {treeData && (
        <Tree
          data={[treeData!]}
          // key={treeData?.emp_id ?? "tree-root"}
          // key={treeKey}
          zoomable={true}
          orientation="horizontal"
          translate={{ x: dimensions.width / 6, y: dimensions.height / 3 }}
          pathFunc="step"
          nodeSize={{ x: 380, y: 130 }}
          collapsible={false}
          // onNodeClick={()=>handleNodeClick(treeData)} 
          // shouldCollapseNeighborNodes={}
          renderCustomNodeElement={renderCustomNode}
        />
      )}
    </div>
  );
};

export default OrganizationTree;