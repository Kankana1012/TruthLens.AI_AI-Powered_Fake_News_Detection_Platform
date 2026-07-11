import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, value, title }) => {
  return (
    <motion.div className="stat-card" whileHover={{ y: -8, scale: 1.02 }}>
      <div className="stat-icon">
        <Icon />
      </div>
      <h2>{value}</h2>
      <p>{title}</p>
    </motion.div>
  );
};

export default StatCard;
