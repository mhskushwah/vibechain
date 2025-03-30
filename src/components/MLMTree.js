// src/components/MLMTree.js
import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../blockchain/config";

const MLMTree = ({ userId }) => {
    const [treeData, setTreeData] = useState(null);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);

    // wallet + contract setup
    useEffect(() => {
        const setup = async () => {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
                setProvider(provider);
                setContract(contract);
            } else {
                alert('Install Metamask');
            }
        };
        setup();
    }, []);

    // recursive tree data fetch (binary structure)
    const fetchTree = async (userId, layer = 0, maxLayers = 3) => {
        if (!contract || layer > maxLayers) return null;

        const userInfo = await contract.userInfo(userId);
        const income = await contract.getLevelIncome(userId);
        const directs = await contract.getMatrixDirect(userId);
        const childrenData = await contract.getMatrixUsers(userId, layer);

        // ensure binary
        const binaryChildrenData = childrenData.slice(0, 2);

        const children = await Promise.all(
            binaryChildrenData.map(child => fetchTree(Number(child.id), layer + 1, maxLayers))
        );

        return {
            name: `ID: ${userId}`,
            attributes: {
                'Total Team': Number(userInfo.totalMatrixTeam),
                'Directs': directs.join(", "),
                'Income': income.reduce((a, b) => a + Number(b), 0)
            },
            children: children.filter(Boolean),
            _collapsed: true  // default collapsed
        };
    };

    // toggle expand/collapse
    const handleNodeClick = (nodeData) => {
        nodeData.data._collapsed = !nodeData.data._collapsed;
        setTreeData({ ...treeData }); // force re-render
    };

    // load tree
    useEffect(() => {
        if (contract) {
            (async () => {
                const data = await fetchTree(userId);
                setTreeData(data);
            })();
        }
    }, [contract, userId]);

    if (!treeData) return <div>Loading Tree...</div>;

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#ffffff', padding: '10px' }}>
            <Tree
                data={treeData}
                orientation="vertical"
                zoomable
                translate={{ x: window.innerWidth / 2, y: 100 }}
                separation={{ siblings: 2, nonSiblings: 2 }}
                collapsible={false} // disable internal collapse
                nodeSvgShape={{ shape: 'circle', shapeProps: { r: 20, fill: '#FF6347' } }}
                styles={{
                    nodes: {
                        node: {
                            circle: { stroke: '#000', strokeWidth: 2 },
                            name: { fontSize: '14px', fill: '#333' },
                            attributes: { fontSize: '12px', fill: '#555' }
                        },
                        leafNode: {
                            circle: { stroke: '#000', strokeWidth: 2 },
                            name: { fontSize: '14px', fill: '#333' },
                            attributes: { fontSize: '12px', fill: '#555' }
                        }
                    }
                }}
                onNodeClick={handleNodeClick}
            />
        </div>
    );
};

export default MLMTree;
