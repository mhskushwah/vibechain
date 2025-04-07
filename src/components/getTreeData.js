import { getContract } from "../blockchain/config";

export const fetchUserTree = async (userId, depth = 2, level = 0) => {
  try {
    const contract = await getContract();

    const user = await contract.userInfo(userId);

    // Skip if user doesn't exist or is invalid
    if (!user || Number(user.id) === 0) {
      console.warn(`User ID ${userId} not found or invalid.`);
      return null;
    }

    const node = {
      name: `ID: ${Number(user.id)}`,
      attributes: {
        Referrer: Number(user.referrer),
        Address: user.wallet || user[0], // fetch wallet address
        Upline: Number(user.upline),
        Start: new Date(Number(user.start) * 1000).toLocaleDateString(),
        Team: Number(user.directTeam),
        TotalTeam: Number(user.totalMatrixTeam ),
      },
      level,
      children: [],
    };

    if (depth > 0) {
      let layer0Users = [];

      try {
        layer0Users = await contract.getMatrixUsers(userId, 0); // Get direct team
      } catch (err) {
        console.warn(`Failed to fetch layer0 users for ID ${userId}:`, err);
      }

      for (const u of layer0Users) {
        const childId = Number(u.id);
        const childNode = await fetchUserTree(childId, depth - 1, level + 1);
        if (childNode) {
          node.children.push(childNode);
        }
      }
    }

    return node;
  } catch (error) {
    console.error(`Error in fetchUserTree for ID ${userId}:`, error);
    return null;
  }
};
