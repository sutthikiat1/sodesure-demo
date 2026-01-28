import { useState, useCallback, useEffect, useRef } from "react";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import {
  MapPin,
  Plus,
  Minus,
  Star,
  MapPinned,
  Navigation,
  X,
} from "lucide-react";
import { useAppContext } from "../../../AppContext";
import MakroLogo from "../../../assets/makrologo.png";
import LotusLogo from "../../../assets/lotuslogo.png";
import CPLogo from "../../../assets/cplogonont.png";

// Animation styles for map pins
const mapAnimationStyles = `
  @keyframes bounce-pin {
    0%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    50% {
      transform: translateX(-50%) translateY(-8px);
    }
  }

  @keyframes pulse-pin {
    0% {
      box-shadow: 0 0 0 0 rgba(47, 122, 89, 0.4);
    }
    70% {
      box-shadow: 0 0 0 15px rgba(47, 122, 89, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(47, 122, 89, 0);
    }
  }

  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .pin-bounce {
    animation: bounce-pin 2s ease-in-out infinite;
  }

  .pin-pulse {
    animation: pulse-pin 2s ease-out infinite;
  }

  .pin-selected {
    animation: bounce-pin 0.5s ease-out;
  }

  .info-window-animate {
    animation: scale-in 0.2s ease-out;
  }

  .fade-in-up {
    animation: fade-in-up 0.3s ease-out;
  }

  /* Store Card Animations */
  @keyframes shimmer-skeleton {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes slide-up-card {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      #f0f0f0 0%,
      #e0e0e0 50%,
      #f0f0f0 100%
    );
    background-size: 200% 100%;
    animation: shimmer-skeleton 1.5s ease-in-out infinite;
  }

  .card-slide-up {
    animation: slide-up-card 0.4s ease-out forwards;
    opacity: 0;
  }

  .card-delay-1 { animation-delay: 0.05s; }
  .card-delay-2 { animation-delay: 0.1s; }
  .card-delay-3 { animation-delay: 0.15s; }
  .card-delay-4 { animation-delay: 0.2s; }
  .card-delay-5 { animation-delay: 0.25s; }
`;

const mapContainerStyle = {
  height: "520px",
  width: "100%",
};

const defaultCenter = {
  lat: 13.7563,
  lng: 100.5018, // Bangkok default
};

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

interface Place {
  id: string;
  name: string;
  position: google.maps.LatLngLiteral;
  address: string;
  rating?: number;
  distance?: number;
}

function MapScreen() {
  const { setCurrentScreen } = useAppContext();
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_APIKEY || "",
    libraries: libraries,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation(defaultCenter);
        },
      );
    } else {
      setUserLocation(defaultCenter);
    }
  }, []);

  // Search for nearby stores
  useEffect(() => {
    if (isMapLoaded && userLocation && isLoaded && !isSearching) {
      setIsSearching(true);
      const service = new google.maps.places.PlacesService(mapRef.current!);
      const searchTerms = [
        "CP Freshmart",
        "CP Fresh Mart",
        "Lotus's",
        "Lotus",
        "Makro",
        "Tesco Lotus",
      ];
      const allFoundPlaces: Place[] = [];
      let completedSearches = 0;

      searchTerms.forEach((term) => {
        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
          radius: 10000, // 10km radius
          keyword: term,
          type: "supermarket",
        };

        service.nearbySearch(request, (results, status) => {
          completedSearches++;

          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            results.forEach((place) => {
              if (place.place_id && place.geometry?.location && place.name) {
                // Check if place already exists
                const exists = allFoundPlaces.some(
                  (p) => p.id === place.place_id,
                );

                if (!exists) {
                  const placePos = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  };

                  // Calculate distance
                  const distance =
                    google.maps.geometry.spherical.computeDistanceBetween(
                      new google.maps.LatLng(
                        userLocation.lat,
                        userLocation.lng,
                      ),
                      new google.maps.LatLng(placePos.lat, placePos.lng),
                    );

                  if (
                    place?.name?.toLocaleLowerCase()?.includes("makro") ||
                    place?.name?.toLocaleLowerCase()?.includes("cp") ||
                    place?.name?.toLocaleLowerCase()?.includes("lotus")
                  ) {
                    allFoundPlaces.push({
                      id: place.place_id,
                      name: place.name,
                      position: placePos,
                      address: place.vicinity || "",
                      rating: place.rating,
                      distance: Math.round((distance / 1000) * 10) / 10, // km with 1 decimal
                    });
                  }
                }
              }
            });
          }

          // Update state after all searches complete
          if (completedSearches === searchTerms.length) {
            // Sort by distance
            const sortedPlaces = allFoundPlaces.sort(
              (a, b) => (a.distance || 0) - (b.distance || 0),
            );
            setPlaces(sortedPlaces);
            setIsSearching(false);
          }

          // เดี๋ยวลบ
          // if (completedSearches === searchTerms.length) {
          //   const sortedPlaces = allFoundPlaces.sort(
          //     (a, b) => (a.distance || 0) - (b.distance || 0),
          //   );

          //   setPlaces(sortedPlaces.slice(0, 1));
          //   setIsSearching(false);
          // }
        });
      });
    }
  }, [isMapLoaded, userLocation, isLoaded]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setIsMapLoaded(true);
  }, []);

  const handleZoomIn = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      if (currentZoom !== undefined && currentZoom < 20) {
        mapRef.current.setZoom(currentZoom + 1);
      }
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      if (currentZoom !== undefined && currentZoom > 1) {
        mapRef.current.setZoom(currentZoom - 1);
      }
    }
  };

  const findLogoLocation = (place: Place) => {
    const name = place?.name?.toLocaleLowerCase();
    if (name?.includes("makro")) {
      return MakroLogo;
    } else if (name?.includes("lotus")) {
      return LotusLogo;
    } else if (name?.includes("cp")) {
      return CPLogo;
    } else {
      return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#059669" stroke="white" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        `)
      );
    }
  };

  const isCertifiedStore = (place: Place) => {
    const name = place?.name?.toLocaleLowerCase();
    const rating = place?.rating || 0;

    // ร้านที่ได้รับการรับรอง: ร้านใหญ่ที่มีชื่อเสียง หรือ ร้านที่มี rating สูง (4.0+)
    const isBigBrand =
      name?.includes("makro") ||
      name?.includes("lotus") ||
      name?.includes("cp") ||
      name?.includes("tesco");

    const hasHighRating = rating >= 4.0;

    return isBigBrand || hasHighRating;
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-2">เกิดข้อผิดพลาดในการโหลดแผนที่</p>
          <p className="text-sm text-gray-600">
            กรุณาตรวจสอบ Google Maps API Key
          </p>
          <button
            onClick={() => setCurrentScreen("features")}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg"
          >
            กลับ
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดแผนที่...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{mapAnimationStyles}</style>
      <div className="min-h-screen mx-auto bg-white flex flex-col">
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              mapContainerClassName="map-container"
              center={userLocation || defaultCenter}
              zoom={14}
              onLoad={onMapLoad}
              onClick={() => setSelectedPlace(null)}
              options={{
                disableDefaultUI: true,
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                clickableIcons: false,
              }}
            >
              {/* User Location Marker */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 3,
                  }}
                />
              )}

              {/* Store Markers with Animation */}
              {places.map((place) => {
                const isSelected = selectedPlace?.id === place.id;
                return (
                  <OverlayView
                    key={place.id}
                    position={place.position}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div
                      onClick={() => {
                        setSelectedPlace(place);
                        // Pan map to ensure modal is fully visible below navbar
                        if (mapRef.current) {
                          mapRef.current.panTo(place.position);
                          // Pan up to show modal clearly (120px offset for modal + navbar)
                          setTimeout(() => {
                            mapRef.current?.panBy(0, -120);
                          }, 100);
                        }
                      }}
                      className={`cursor-pointer flex justify-center flex-col w-fit pin-bounce ${
                        isSelected ? "z-50" : "z-10"
                      }`}
                      style={{ transform: "translateX(-50%)" }}
                    >
                      {/* Pin Container */}
                      <div
                        className={`relative ${isSelected ? "scale-125" : ""} transition-transform duration-200`}
                      >
                        {findLogoLocation(place) ? (
                          <div
                            className={`w-12 h-12 rounded-full overflow-hidden border-3 shadow-lg bg-white ${
                              isSelected
                                ? "border-primary pin-pulse"
                                : "border-white"
                            }`}
                          >
                            <img
                              src={findLogoLocation(place)}
                              alt={place.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className={`w-12 h-12 bg-primary rounded-full flex items-center justify-center border-3 shadow-lg ${
                              isSelected
                                ? "border-primary/50 pin-pulse"
                                : "border-white"
                            }`}
                          >
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                        )}
                        {/* Pointer */}
                        <div
                          className={`w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent mx-auto -mt-[2px] ${
                            isSelected ? "border-t-primary" : "border-t-white"
                          }`}
                        />
                      </div>
                    </div>
                  </OverlayView>
                );
              })}

              {/* Modern Info Window */}
              {selectedPlace && (
                <OverlayView
                  position={selectedPlace.position}
                  mapPaneName={OverlayView.FLOAT_PANE}
                >
                  <div
                    className="info-window-animate"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      left: "-140px",
                      bottom: "30px",
                    }}
                  >
                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-[280px] relative">
                      {/* Header with gradient */}
                      <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3 relative">
                        {/* Close button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlace(null);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>

                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/30 bg-white shrink-0">
                            <img
                              src={findLogoLocation(selectedPlace)}
                              alt={selectedPlace.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-sm leading-tight line-clamp-1">
                              {selectedPlace.name}
                            </h3>
                            {isCertifiedStore(selectedPlace) && (
                              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-medium px-2 py-0.5 rounded-full mt-1">
                                <svg
                                  className="w-3 h-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Certified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        {/* Address */}
                        <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                          {selectedPlace.address}
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center gap-3 mb-3">
                          {selectedPlace.rating && (
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="text-xs font-semibold text-amber-700">
                                {selectedPlace.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                          {selectedPlace.distance && (
                            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                              <MapPinned className="w-3.5 h-3.5 text-blue-500" />
                              <span className="text-xs font-semibold text-blue-700">
                                {selectedPlace.distance} km
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Navigate Button */}
                        <a
                          href={`https://maps.google.com/maps?daddr=${selectedPlace.position.lat},${selectedPlace.position.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] text-sm"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>นำทาง</span>
                        </a>
                      </div>

                      {/* Arrow pointer at bottom center of card */}
                      <div
                        className="absolute left-1/2 -bottom-2 -translate-x-1/2"
                        style={{
                          filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.08))",
                        }}
                      >
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
                      </div>
                    </div>
                  </div>
                </OverlayView>
              )}

              {/* Custom Zoom Controls */}
              <div className="absolute bottom-[100px] right-[16px] flex h-[92px] w-[45px] flex-col items-center rounded-md bg-white shadow-md">
                <button
                  onClick={handleZoomIn}
                  className="h-full w-[45px] cursor-pointer p-1 text-lg font-extrabold hover:bg-gray-100 rounded-t-md transition-colors"
                >
                  <Plus className="w-6 h-6 mx-auto" />
                </button>
                <div className="h-[1px] w-[80%] bg-slate-200" />
                <button
                  onClick={handleZoomOut}
                  className="h-full w-[45px] cursor-pointer p-1 text-lg font-extrabold hover:bg-gray-100 rounded-b-md transition-colors"
                >
                  <Minus className="w-6 h-6 mx-auto" />
                </button>
              </div>
            </GoogleMap>
          </div>
          {/* Store List */}
          {(places?.length > 0 || isSearching) && (
            <div
              className={`
                absolute left-0 right-0 rounded-t-3xl
                transition-all duration-300 ease-in-out h-fit
                ${isExpanded ? "" : ""}
              `}
            >
              <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full pt-2 flex justify-center cursor-pointer"
              >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    ร้านค้าใกล้เคียง
                  </h2>
                  {!isSearching && (
                    <span className="text-lg font-semibold text-gray-500 bg-gray-200 rounded-full px-3 py-1">
                      {places.length}
                    </span>
                  )}
                  {isSearching && (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-primary"></div>
                  )}
                </div>

                {/* Store Cards or Skeleton */}
                <div className="space-y-3 mb-20">
                  {isSearching ? (
                    // Skeleton Loading - matching new card design
                    <>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
                        >
                          <div className="flex items-center gap-3 p-3">
                            {/* Skeleton Logo */}
                            <div className="w-14 h-14 shrink-0 rounded-xl skeleton-shimmer"></div>

                            {/* Skeleton Info */}
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="h-4 skeleton-shimmer rounded-lg w-3/4"></div>
                              <div className="h-3 skeleton-shimmer rounded-lg w-full"></div>
                              <div className="flex items-center gap-2">
                                <div className="h-5 skeleton-shimmer rounded-full w-14"></div>
                                <div className="h-5 skeleton-shimmer rounded-full w-16"></div>
                              </div>
                            </div>

                            {/* Skeleton Arrow */}
                            <div className="w-7 h-7 skeleton-shimmer rounded-full shrink-0"></div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    // Actual Store Cards with animation
                    places.map((place, index) => (
                      <div
                        key={place.id}
                        onClick={() => {
                          setIsExpanded(false);

                          mapContainerRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });

                          setTimeout(() => {
                            mapRef.current?.panTo(place.position);
                            mapRef.current?.setZoom(16);
                            setSelectedPlace(place);
                          }, 300);
                        }}
                        className={`bg-white rounded-2xl shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary/30 active:scale-[0.98] card-slide-up card-delay-${Math.min(index + 1, 5)}`}
                      >
                        <div className="flex items-center gap-3 p-3">
                          {/* Store Logo */}
                          <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                              <img
                                src={findLogoLocation(place)}
                                alt={place.name}
                                className="w-12 h-12 object-contain"
                              />
                            </div>
                            {/* Certified badge */}
                            {isCertifiedStore(place) && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow border-2 border-white">
                                <svg
                                  className="w-2.5 h-2.5 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Store Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 text-sm line-clamp-1 mb-0.5">
                              {place.name}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                              {place.address}
                            </p>

                            {/* Rating and Distance inline */}
                            <div className="flex items-center gap-2">
                              {place.rating && (
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                  <span className="font-medium text-amber-700 text-xs">
                                    {place.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                              {place.distance && (
                                <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                                  <MapPinned className="w-3 h-3 text-blue-500" />
                                  <span className="font-medium text-blue-700 text-xs">
                                    {place.distance} km
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Arrow indicator */}
                          <div className="flex-shrink-0">
                            <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3.5 h-3.5 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MapScreen;
