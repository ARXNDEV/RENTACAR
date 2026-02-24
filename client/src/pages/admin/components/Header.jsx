import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Header = ({ category, title }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-6 flex flex-col"
    >
      {category && (
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2 px-1">
          {category}
        </p>
      )}
      <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
        {title}
      </h2>
    </motion.div>
  );
}

Header.propTypes = {
  category: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Header;