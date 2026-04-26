import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { checkPaymentStatus } from "../utils/payment";
import { motion } from "framer-motion";

function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isValid } = checkPaymentStatus();

  // Variasi animasi untuk elemen yang muncul berurutan
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      id="landing-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <section className="hero">
        {/* Animated Lanterns */}
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.span
            key={i}
            className={`lantern lantern-${i}`}
            animate={{
              y: [0, -20, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🏮
          </motion.span>
        ))}

        <div className="hero-content">
          <motion.div variants={itemVariants} className="hero-badge">
            <span className="dragon-icon">🐉</span>
            <span>{t("landing.subtitle")}</span>
          </motion.div>

          <motion.p variants={itemVariants} className="hero-welcome">
            {t("landing.welcome")}
          </motion.p>

          <motion.h1 variants={itemVariants} className="hero-title">
            {t("landing.title")}
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-description">
            {t("landing.description")}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="hero-actions"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              className={`btn btn-gold btn-lg ${isValid ? "btn-active" : ""}`}
              onClick={() => navigate(isValid ? "/tour" : "/payment")}
            >
              <span className="btn-icon">{isValid ? "🎯" : "🎫"}</span>
              <span className="btn-text">
                {isValid ? t("landing.alreadyPaid") : t("landing.startTour")}
              </span>
            </button>
          </motion.div>

          {/* Hapus struktur stat sebelumnya, ganti dengan ini */}
          <motion.div variants={itemVariants} className="hero-stats-minimal">
            <div className="stat-item">
              <h2 className="stat-number">269</h2>
              <p className="stat-label">{t("landing.history")}</p>
            </div>

            <div className="stat-item">
              <h2 className="stat-number">50K+</h2>
              <p className="stat-label">{t("landing.visitors")}</p>
            </div>

            <div className="stat-item">
              <h2 className="stat-number">
                4.8<span className="stat-star">★</span>
              </h2>
              <p className="stat-label">{t("landing.rating")}</p>{" "}
              {/* Pastikan tambah kunci i18n untuk rating */}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="divider"
        >
          <span className="divider-line"></span>
          <span className="divider-icon">☯</span>
          <span className="divider-line"></span>
        </motion.div>

        <div className="features-grid">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="glass-card feature-card"
              whileHover={{ y: -10, backgroundColor: "rgba(255, 215, 0, 0.1)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="feature-icon-wrapper">
                <span className="feature-icon">
                  {i === 1 ? "🎥" : i === 2 ? "📡" : "🌏"}
                </span>
              </div>
              <h3 className="feature-title">{t(`landing.feature${i}Title`)}</h3>
              <p className="feature-desc">{t(`landing.feature${i}Desc`)}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default LandingPage;
