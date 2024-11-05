"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Button, Select, SelectItem, Chip } from "@nextui-org/react";

interface CityLocalityMap {
  [key: string]: string[];
}

interface FloatingActionButtonProps {
  cityLocalityMap: CityLocalityMap;
  selectedCities: string[];
  setSelectedCities: (cities: string[]) => void;
  selectedLocalities: string[];
  setSelectedLocalities: (localities: string[]) => void;
}

export default function FloatingActionButton({
  cityLocalityMap,
  selectedCities,
  setSelectedCities,
  selectedLocalities,
  setSelectedLocalities,
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // const [selectedCity, setSelectedCity] = useState("Goa");

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const localities = cityLocalityMap;
  const cities = Object.keys(localities);

  // useEffect(() => {
  //   if (selectedCity === "Delhi") {
  //     setSelectedCities(["Delhi"]);
  //   } else if (selectedCity === "Goa") {
  //     setSelectedCities(["Goa"]);
  //   }
  // }, [selectedCity]);

  return (
    <motion.div
      layout
      initial={false}
      animate={isExpanded ? "expanded" : "collapsed"}
      className="fixed bottom-28 right-3 overflow-hidden"
    >
      <motion.div
        variants={{
          collapsed: { width: 45, height: 45, borderRadius: "50%" },
          expanded: {
            width: "calc(100vw - 1.5rem)",
            height: "80vh",
            borderRadius: "1rem",
          },
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`bg-background text-foreground shadow-lg flex items-center justify-center z-50 ${
          isExpanded ? "border-2 border-slate-600" : ""
        }`}
      >
        <AnimatePresence>
          {isExpanded ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full h-full flex flex-col items-center justify-center p-8 pb-20 relative"
            >
              <Button
                size="sm"
                isIconOnly
                className="absolute top-4 right-4 hover:text-gray-300 bg-transparent"
                onClick={toggleExpand}
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close filter options</span>
              </Button>
              <div className="space-y-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center">
                  Filter Options
                </h2>
                {/* <div className="flex items-center justify-start space-x-4">
                  <span
                    className={`text-md ${
                      selectedCity === "Goa" ? "text-primary" : ""
                    }`}
                  >
                    Goa
                  </span>
                  <Switch
                    isSelected={selectedCity === "Delhi"}
                    onValueChange={() =>
                      setSelectedCity((prev) =>
                        prev === "Goa" ? "Delhi" : "Goa"
                      )
                    }
                    thumbIcon={
                      <span>{selectedCity === "Delhi" ? "D" : "G"}</span>
                    }
                    classNames={{
                      // base: "inline-flex items-center",
                      wrapper: cn(
                        "bg-primary", // Always green background
                        "group-data-[selected=true]:bg-primary" // Stays green when selected
                      ),
                      // thumb: cn(
                      //   "w-6 h-6 border-2 shadow-lg",
                      //   "group-data-[selected=true]:ml-6",
                      //   "group-data-[pressed=true]:w-7",
                      //   "group-data-[selected]:group-data-[pressed]:ml-4",
                      // ),
                    }}
                  />
                  <span
                    className={`text-md ${
                      selectedCity === "Delhi" ? "text-primary" : ""
                    }`}
                  >
                    Delhi
                  </span>
                </div> */}
                <Select
                  label="Select cities"
                  // placeholder="Select cities"
                  selectionMode="multiple"
                  variant="bordered"
                  selectedKeys={selectedCities}
                  isMultiline
                  onSelectionChange={(keys) =>
                    setSelectedCities(Array.from(keys) as string[])
                  }
                  className="w-full"
                  renderValue={(items) => {
                    return (
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                          <Chip key={item.key}>{item.key}</Chip>
                        ))}
                      </div>
                    );
                  }}
                >
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Select localities"
                  // placeholder="Select localities"
                  selectionMode="multiple"
                  selectedKeys={selectedLocalities}
                  isMultiline
                  variant="bordered"
                  onSelectionChange={(keys) =>
                    setSelectedLocalities(Array.from(keys) as string[])
                  }
                  className="w-full"
                  renderValue={(items) => {
                    return (
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                          <Chip key={item.key}>{item.key}</Chip>
                        ))}
                      </div>
                    );
                  }}
                >
                  {selectedCities.flatMap(
                    (city) =>
                      localities[city as keyof typeof localities]?.map(
                        (locality) => (
                          <SelectItem key={locality} value={locality}>
                            {locality}
                          </SelectItem>
                        )
                      ) || []
                  )}
                </Select>
                <div className="absolute bottom-6 right-6">
                  <Button
                    color="primary"
                    variant="flat"
                    onClick={toggleExpand}
                    className="px-8"
                    // startContent={<X className="h-4 w-4" />}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleExpand}
              className="w-full h-full flex items-center justify-center"
            >
              <SlidersHorizontal className="h-6 w-6" />
              <span className="sr-only">Open filter options</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
