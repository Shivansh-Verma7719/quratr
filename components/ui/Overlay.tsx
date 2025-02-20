import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Image,
  AvatarGroup,
  Avatar,
  Chip,
} from "@heroui/react";
import { MapPin, Star, Users, IndianRupee, Tag, Heart } from "lucide-react";
import { User } from "@/components/UserSelection";
import { Card } from "@/app/group_swipe/page";

interface OverlayProps {
  isVisible: boolean;
  onClose: () => void;
  place?: Card;
  groupMembers?: User[];
  onRedeem?: () => void;
}

export const PlaceDrawer = ({
  isVisible,
  onClose,
  place,
  groupMembers = [],
  onRedeem,
}: OverlayProps) => {
  return (
    <Drawer
      isOpen={isVisible}
      onClose={onClose}
      placement="bottom"
      size="3xl"
      backdrop="blur"
      classNames={{
        body: "p-0",
      }}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex items-center justify-between bg-transparent">
              <h2 className="text-xl font-semibold">Group Match! 🎉</h2>
            </DrawerHeader>

            <DrawerBody>
              <div className="relative flex w-full items-center justify-center pt-8">
                <Image
                  isBlurred
                  src={place?.image}
                  alt={place?.name}
                  className="h-80 w-full object-cover"
                  loading="eager"
                />
              </div>

              <div className="space-y-6 px-6 py-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{place?.name}</h3>
                  {(place?.locality || place?.city_name) && (
                    <div className="flex items-center gap-2 text-default-500">
                      <MapPin size={16} />
                      <span>
                        {[place.locality, place.city_name]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4">
                    {place?.rating && (
                      <div className="flex items-center gap-1">
                        <Star
                          className="text-yellow-500"
                          fill="#eab308"
                          size={16}
                        />
                        <span>{place.rating}</span>
                      </div>
                    )}
                    {place?.price && place?.price > 0 && (
                      <div className="flex items-center gap-1">
                        <IndianRupee size={16} />
                        <span>₹{place.price} for 2</span>
                      </div>
                    )}
                    {place?.likes && place?.likes > 10 && (
                      <div className="flex items-center gap-1">
                        <Heart size={16} className="text-danger" />
                        <span>{place.likes} likes</span>
                      </div>
                    )}
                  </div>

                  {place?.tags && (
                    <div className="flex flex-wrap gap-2">
                      <Tag
                        size={16}
                        className="translate-y-1 text-default-500"
                      />
                      {place.tags.split(",").map((tag, index) => (
                        <Chip
                          key={index}
                          size="sm"
                          variant="flat"
                          color="secondary"
                        >
                          {tag.trim()}
                        </Chip>
                      ))}
                    </div>
                  )}
                  {place?.group_experience === "1" && (
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <Chip color="success" variant="flat">
                        Perfect for Groups
                      </Chip>
                    </div>
                  )}
                </div>

                {place?.description && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">About</h4>
                    <p className="text-sm text-default-600">
                      {place.description}
                    </p>
                  </div>
                )}

                {place?.address && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Location</h4>
                    <p className="text-sm text-default-600">{place.address}</p>
                  </div>
                )}

                {place?.reservation && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Reservation</h4>
                    <p className="text-sm text-default-600">
                      {place.reservation}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 font-semibold">
                    <Users size={16} />
                    Group Members who liked this
                  </h4>
                  <AvatarGroup max={3} isBordered className="justify-start">
                    {groupMembers.map((user) => (
                      <Avatar
                        key={user.id}
                        size="sm"
                        name={user.first_name + " " + user.last_name}
                        getInitials={(name) =>
                          name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                        }
                        showFallback
                        color="secondary"
                      />
                    ))}
                  </AvatarGroup>
                </div>
              </div>
            </DrawerBody>

            <DrawerFooter className="px-6 py-4">
              <div className="flex w-full gap-4">
                <Button onPress={onClose} variant="flat" className="flex-1">
                  Keep Swiping
                </Button>
                <Button
                  onPress={onRedeem}
                  color="success"
                  variant="solid"
                  className="flex-1"
                >
                  Redeem Discount
                </Button>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};
