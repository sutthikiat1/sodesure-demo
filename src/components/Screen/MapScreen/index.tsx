import { useState, useCallback, useEffect, useRef } from "react";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
  OverlayView,
} from "@react-google-maps/api";
import { ArrowLeft, MapPin, Plus, Minus } from "lucide-react";
import { useAppContext } from "../../../AppContext";
import MakroLogo from "../../../assets/makrologo.png";
import LotusLogo from "../../../assets/lotuslogo.png";
import CPLogo from "../../../assets/cplogo.png";

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
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_APIKEY || "",
    libraries: libraries,
  });

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
        }
      );
    } else {
      setUserLocation(defaultCenter);
    }
  }, []);

  // Search for nearby stores
  useEffect(() => {
    if (mapRef.current && userLocation && isLoaded && !isSearching) {
      setIsSearching(true);
      const service = new google.maps.places.PlacesService(mapRef.current);
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
                  (p) => p.id === place.place_id
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
                        userLocation.lng
                      ),
                      new google.maps.LatLng(placePos.lat, placePos.lng)
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
              (a, b) => (a.distance || 0) - (b.distance || 0)
            );
            setPlaces(sortedPlaces);
            setIsSearching(false);
          }
        });
      });
    }
  }, [mapRef.current, userLocation, isLoaded]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
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

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดแผนที่...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto bg-white flex flex-col">
      {/* Header */}
      <div className="bg-primary text-white p-4 shadow-md flex items-center">
        <button
          onClick={() => setCurrentScreen("features")}
          className="mr-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">ร้านค้าใกล้เคียง</h1>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          mapContainerClassName="map-container"
          center={userLocation || defaultCenter}
          zoom={14}
          onLoad={onMapLoad}
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

          {/* Store Markers */}
          {places.map((place) => {
            return (
              <OverlayView
                key={place.id}
                position={place.position}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  onClick={() => setSelectedPlace(place)}
                  className="cursor-pointer transform -translate-x-1/2 -translate-y-full flex justify-center flex-col w-fit"
                >
                  {findLogoLocation(place) ? (
                    // รูปภาพแบบวงกลมไม่มีพื้นหลัง
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg bg-transparent">
                      <img
                        src={findLogoLocation(place)}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    // Default marker icon
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {/* หางของ marker */}
                  <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-white mx-auto -mt-[2px]" />
                </div>
              </OverlayView>
            );
          })}

          {/* Info Window */}
          {selectedPlace && (
            <InfoWindow
              position={selectedPlace.position}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div className="p-2">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={findLogoLocation(selectedPlace)}
                    width={40}
                    height={40}
                    className="rounded-full border-primary border-2 object-cover"
                  />
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {selectedPlace.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedPlace.address}
                </p>
                {selectedPlace.distance && (
                  <p className="text-sm text-blue-600 mb-1">
                    📍 {selectedPlace.distance} กม.
                  </p>
                )}
                {selectedPlace.rating && (
                  <p className="text-sm text-yellow-600">
                    ⭐ {selectedPlace.rating.toFixed(1)}
                  </p>
                )}
                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.position.lat},${selectedPlace.position.lng}`;
                    window.open(url, "_blank");
                  }}
                  className="mt-2 text-sm text-primary font-medium hover:underline"
                >
                  นำทาง
                </button>
              </div>
            </InfoWindow>
          )}

          {/* Custom Zoom Controls */}
          <div className="absolute bottom-[16px] right-[16px] flex h-[92px] w-[45px] flex-col items-center rounded-md bg-white shadow-md">
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

        {/* Store List */}
        {places.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl max-h-[40%] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center mb-3">
                <MapPin className="w-5 h-5 text-primary mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">
                  พบ {places.length} ร้าน
                </h2>
              </div>
              <div className="space-y-2">
                {places.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => {
                      setSelectedPlace(place);
                      mapRef.current?.panTo(place.position);
                      mapRef.current?.setZoom(16);
                    }}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <h3 className="font-medium text-gray-800">{place.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {place.address}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {place.distance && (
                        <p className="text-sm text-blue-600">
                          📍 {place.distance} กม.
                        </p>
                      )}
                      {place.rating && (
                        <p className="text-sm text-yellow-600">
                          ⭐ {place.rating.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapScreen;
