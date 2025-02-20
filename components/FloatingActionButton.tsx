"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button, Switch } from "@heroui/react";
import { MultiSelect } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CityLocalityMap {
  [key: string]: string[];
}

interface FloatingActionButtonProps {
  cityLocalityMap: CityLocalityMap;
  selectedCities: string[];
  setSelectedCities: (cities: string[]) => void;
  selectedLocalities: string[];
  setSelectedLocalities: (localities: string[]) => void;
  numberOfFilters: number;
}

export default function FloatingActionButton({
  cityLocalityMap,
  selectedCities,
  setSelectedCities,
  selectedLocalities,
  setSelectedLocalities,
  numberOfFilters,
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCity, setSelectedCity] = useState(
    JSON.parse(localStorage.getItem("selectedCities") || "[]")[0] || "Delhi NCR"
  );

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const localities = cityLocalityMap;
  const cities = Object.keys(localities);

  useEffect(() => {
    if (selectedCity === "Delhi NCR") {
      setSelectedCities(["Delhi NCR"]);
    } else if (selectedCity === "Goa") {
      setSelectedCities(["Goa"]);
    }
  }, [selectedCity]);

  return (
    <motion.div
      layout
      initial={false}
      animate={isExpanded ? "expanded" : "collapsed"}
      className="overflow-v fixed bottom-28 right-3"
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
        className={`z-50 flex items-center justify-center bg-background text-foreground shadow-lg ${
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
              className="relative flex h-full w-full flex-col items-center justify-center p-8 pb-20"
            >
              <Button
                size="sm"
                isIconOnly
                className="absolute right-4 top-4 bg-transparent hover:text-gray-300"
                onPress={toggleExpand}
              >
                <X className="h-6 w-6" />
              </Button>
              <div className="w-full max-w-md space-y-6">
                <h2 className="text-center text-2xl font-bold">Filter</h2>
                <div className="flex items-center justify-start space-x-4">
                  <span
                    className={`text-md ${
                      selectedCity === "Goa" ? "text-primary" : ""
                    }`}
                  >
                    Goa
                  </span>
                  <Switch
                    isSelected={selectedCity === "Delhi NCR"}
                    onValueChange={() =>
                      setSelectedCity((prev: string) =>
                        prev === "Goa" ? "Delhi" : "Goa"
                      )
                    }
                    thumbIcon={
                      <span>{selectedCity === "Delhi NCR" ? "D" : "G"}</span>
                    }
                    classNames={{
                      wrapper: cn(
                        "bg-primary", // Always green background
                        "group-data-[selected=true]:bg-primary" // Stays green when selected
                      ),
                    }}
                  />
                  <span
                    className={`text-md ${
                      selectedCity === "Delhi NCR" ? "text-primary" : ""
                    }`}
                  >
                    Delhi
                  </span>
                </div>
                <MultiSelect
                  items={cities}
                  placeholder="Select cities"
                  selectedItems={selectedCities}
                  onChange={setSelectedCities}
                />
                <MultiSelect
                  items={selectedCities.flatMap(
                    (city) => localities[city as keyof typeof localities] || []
                  )}
                  placeholder="Select localities"
                  selectedItems={selectedLocalities}
                  onChange={setSelectedLocalities}
                />
                <div className="absolute bottom-6 right-6">
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={toggleExpand}
                    className="px-8"
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
              className="relative flex h-full w-full items-center justify-center overflow-visible"
            >
              <SlidersHorizontal className="h-6 w-6" />
              {numberOfFilters > 0 && (
                <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {numberOfFilters}
                </div>
              )}
              <span className="sr-only">Open filter options</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
