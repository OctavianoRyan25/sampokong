import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  startTracking,
  stopTracking,
  findNearbyDestinations,
} from "../utils/geolocation";
import { getVisitedDestinations, markAsVisited } from "../utils/payment";
import GPSStatus from "../components/GPSStatus";
import DestinationCard from "../components/DestinationCard";

// Dummy destinations for Sam Poo Kong (real coordinates near Semarang)
const DUMMY_DESTINATIONS = [
  {
    id: "dest-1",
    name_id: "Gerbang Utama Sam Poo Kong",
    name_en: "Sam Poo Kong Main Gate",
    name_cn: "三保公庙正门",
    description_id:
      "Gerbang utama Klenteng Sam Poo Kong yang megah dengan arsitektur khas Tiongkok. Gerbang ini dihiasi dengan ornamen naga dan phoenix yang melambangkan keberuntungan dan kemakmuran. Dibangun dengan gaya arsitektur Dinasti Ming, gerbang ini menjadi pintu masuk pertama bagi para pengunjung yang ingin menjelajahi kompleks klenteng bersejarah ini.",
    description_en:
      "The magnificent main gate of Sam Poo Kong Temple with distinctive Chinese architecture. This gate is adorned with dragon and phoenix ornaments symbolizing good fortune and prosperity. Built in Ming Dynasty architectural style, this gate serves as the first entrance for visitors wishing to explore this historic temple complex.",
    description_cn:
      "三保公庙宏伟的正门，具有鲜明的中国建筑风格。大门装饰着象征好运和繁荣的龙凤图案。以明朝建筑风格建造，这座大门是游客探索这座历史悠久的寺庙建筑群的第一个入口。",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    latitude: -6.9977938229105465,
    longitude: 110.4083737649477,
    radius: 1000,
  },
  {
    id: "dest-2",
    name_id: "Gedung Batu (Kelenteng Utama)",
    name_en: "Gedung Batu (Main Temple)",
    name_cn: "石屋（主殿）",
    description_id:
      "Gedung Batu merupakan bangunan utama dan tertua di kompleks Sam Poo Kong. Di sinilah terdapat gua tempat Laksamana Zheng He (Cheng Ho) pertama kali singgah dan beribadah pada abad ke-15. Bangunan ini menyimpan altar utama dengan patung Zheng He dan berbagai artefak bersejarah yang mencerminkan akulturasi budaya Tionghoa, Jawa, dan Islam.",
    description_en:
      "Gedung Batu is the main and oldest building in the Sam Poo Kong complex. This is where the cave is located where Admiral Zheng He (Cheng Ho) first stopped and worshipped in the 15th century. This building houses the main altar with a statue of Zheng He and various historical artifacts reflecting the acculturation of Chinese, Javanese, and Islamic cultures.",
    description_cn:
      "石屋是三保公庙建筑群中最主要和最古老的建筑。这里有郑和（成和）在15世纪首次停留并礼拜的洞穴。建筑内设有郑和雕像的主祭坛和各种反映中国、爪哇和伊斯兰文化交融的历史文物。",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    latitude: -6.997,
    longitude: 110.3978,
    radius: 40,
  },
  {
    id: "dest-3",
    name_id: "Klenteng Tay Kak Sie",
    name_en: "Tay Kak Sie Temple",
    name_cn: "大觉寺",
    description_id:
      "Klenteng Tay Kak Sie adalah salah satu bangunan ibadah penting dalam kompleks Sam Poo Kong. Klenteng ini didedikasikan untuk Dewi Kwan Im (Avalokitesvara) dan memiliki Interior yang dihiasi dengan ukiran kayu yang sangat detail, lampion merah yang menggantung, serta aroma dupa yang menenangkan. Arsitekturnya memadukan elemen Buddhis dan Taoisme.",
    description_en:
      "Tay Kak Sie Temple is one of the important worship buildings within the Sam Poo Kong complex. This temple is dedicated to Goddess Kwan Im (Avalokitesvara) and features an interior adorned with highly detailed wood carvings, hanging red lanterns, and the calming aroma of incense. Its architecture blends Buddhist and Taoist elements.",
    description_cn:
      "大觉寺是三保公庙建筑群中重要的礼拜场所之一。这座寺庙供奉观音菩萨，内部装饰着精细的木雕、悬挂的红灯笼和令人平静的香火气息。建筑融合了佛教和道教元素。",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    latitude: -6.9962,
    longitude: 110.3985,
    radius: 35,
  },
  {
    id: "dest-4",
    name_id: "Makam Kyai Juru Mudi",
    name_en: "Tomb of Kyai Juru Mudi",
    name_cn: "舵手墓",
    description_id:
      "Makam Kyai Juru Mudi (Wang Jinghong) merupakan makam jurumudi kapal Laksamana Zheng He yang memilih tinggal di Semarang. Makam ini menjadi simbol penting dari hubungan maritim antara Tiongkok dan Nusantara. Di dekat makam terdapat pohon tua berusia ratusan tahun yang akarnya telah menyatu dengan struktur bangunan, menambah kesan mistis dan sakral dari tempat ini.",
    description_en:
      "The Tomb of Kyai Juru Mudi (Wang Jinghong) is the tomb of Admiral Zheng He's helmsman who chose to stay in Semarang. This tomb is an important symbol of the maritime relationship between China and the Archipelago. Near the tomb stands a centuries-old tree whose roots have merged with the building structure, adding a mystical and sacred impression to this place.",
    description_cn:
      "舵手墓（王景弘）是选择留在三宝垄的郑和舰队舵手的墓地。这座墓是中国与群岛之间海上关系的重要象征。墓附近有一棵数百年的古树，其根已与建筑结构融为一体，增添了这个地方的神秘和神圣氛围。",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    latitude: -6.9974,
    longitude: 110.399,
    radius: 30,
  },
  {
    id: "dest-5",
    name_id: "Taman dan Kolam Naga",
    name_en: "Garden and Dragon Pond",
    name_cn: "花园和龙池",
    description_id:
      "Taman dan Kolam Naga merupakan area terbuka yang indah di dalam kompleks Sam Poo Kong. Kolam ini dihiasi dengan patung naga yang menyemburkan air, dikelilingi oleh taman yang tertata rapi dengan tanaman khas Tiongkok. Area ini sering digunakan untuk acara budaya dan festival Cap Go Meh. Suasana tenang dan asri menjadikan tempat ini sempurna untuk kontemplasi dan menikmati keindahan arsitektur klenteng.",
    description_en:
      "The Garden and Dragon Pond is a beautiful open area within the Sam Poo Kong complex. The pond is decorated with dragon statues spouting water, surrounded by well-manicured gardens with typical Chinese plants. This area is often used for cultural events and Cap Go Meh festival. The serene and lush atmosphere makes it a perfect place for contemplation and enjoying the beauty of temple architecture.",
    description_cn:
      "花园和龙池是三保公庙建筑群内一个美丽的开放区域。池塘装饰着喷水的龙雕像，周围环绕着布置整齐的中国特色植物花园。该区域常用于文化活动和元宵节庆典。宁静而苍翠的氛围使其成为沉思和欣赏寺庙建筑之美的理想场所。",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    latitude: -6.9958,
    longitude: 110.398,
    radius: 45,
  },
];

function TourPage() {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState([]);
  const [gpsStatus, setGpsStatus] = useState("inactive");
  const [accuracy, setAccuracy] = useState(null);
  const [visited, setVisited] = useState(getVisitedDestinations());
  const [loading, setLoading] = useState(true);
  const watchIdRef = useRef(null);

  // Load destinations from Firestore or use dummy data
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "destinations"), orderBy("id", "asc")),
        );
        if (!querySnapshot.empty) {
          const firestoreData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDestinations(firestoreData);
        } else {
          await seedDestinations();
          setDestinations(DUMMY_DESTINATIONS);
        }
      } catch (error) {
        console.warn(
          "Firestore not available, using dummy data:",
          error.message,
        );
        setDestinations(DUMMY_DESTINATIONS);
      }
      setLoading(false);
    };

    loadDestinations();
  }, []);

  // GPS Tracking
  const handlePositionUpdate = useCallback(
    (position) => {
      setGpsStatus("active");
      setAccuracy(position.accuracy);

      // Find nearby destinations
      const updated = findNearbyDestinations(
        position.latitude,
        position.longitude,
        destinations,
      );
      setDestinations(updated);
    },
    [destinations],
  );

  const handleGPSError = useCallback((error) => {
    if (error.code === 1) {
      setGpsStatus("denied");
    } else {
      setGpsStatus("inactive");
    }
    console.error("GPS Error:", error.message);
  }, []);

  const startGPS = useCallback(() => {
    setGpsStatus("searching");
    const watchId = startTracking(handlePositionUpdate, handleGPSError);
    watchIdRef.current = watchId;
  }, [handlePositionUpdate, handleGPSError]);

  // Cleanup GPS on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        stopTracking(watchIdRef.current);
      }
    };
  }, []);

  const handleMarkVisited = (destinationId) => {
    markAsVisited(destinationId);
    setVisited(getVisitedDestinations());
  };

  const seedDestinations = async () => {
    try {
      for (const destination of DUMMY_DESTINATIONS) {
        await addDoc(collection(db, "destinations"), destination);
      }
      console.log("Destinations seeded successfully");
    } catch (error) {
      console.error("Error seeding destinations:", error.message);
    }
  };

  const visitedCount = visited.length;
  const totalCount = destinations.length;
  const progressPercent =
    totalCount > 0 ? (visitedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner spinner-lg"></div>
        <p className="loading-text">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="tour-page" id="tour-page">
      <div className="tour-header">
        <h1 className="tour-title">{t("tour.title")}</h1>
        <GPSStatus status={gpsStatus} accuracy={accuracy} />

        {gpsStatus === "inactive" && (
          <button
            className="btn btn-gold"
            onClick={startGPS}
            id="enable-gps-btn"
            style={{ marginTop: "var(--space-md)" }}
          >
            📡 {t("tour.enableGPS")}
          </button>
        )}

        {gpsStatus === "denied" && (
          <p
            style={{
              color: "var(--color-red-light)",
              fontSize: "0.85rem",
              marginTop: "var(--space-sm)",
            }}
          >
            {t("tour.permissionDenied")}
          </p>
        )}
      </div>

      {/* Progress */}
      <div className="progress-section">
        <div className="progress-label">
          <span>{t("tour.progress")}</span>
          <span>
            {visitedCount}/{totalCount}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Destination List */}
      <div className="destinations-list" id="destinations-list">
        {destinations.map((dest, index) => (
          <DestinationCard
            key={dest.id}
            destination={dest}
            index={index}
            isVisited={visited.includes(dest.id)}
            onView={handleMarkVisited}
          />
        ))}
      </div>
    </div>
  );
}

export default TourPage;
