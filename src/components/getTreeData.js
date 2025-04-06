import { getContract } from "../blockchain/config";

export const fetchUserTree = async (userId, depth = 3, level = 0) => {
  const contract = await getContract();
  const user = await contract.userInfo(userId);

  const node = {
    name: `ID: ${Number(user.id)}`,
    attributes: {
      Referrer: Number(user.referrer),
      Upline: Number(user.upline),
      Start: new Date(Number(user.start) * 1000).toLocaleDateString(),
      Team: Number(user.directTeam),
    },
    level,
    children: [],
  };

  if (depth > 0) {
    const children = await contract.getMatrixUsers(userId, 0);
    for (const child of children) {
      const childId = Number(child.id || child);
      const childNode = await fetchUserTree(childId, depth - 1, level + 1);
      node.children.push(childNode);
    }
  }

  return node;
};
