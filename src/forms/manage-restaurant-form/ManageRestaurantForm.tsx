import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types";
import { useEffect } from "react";

const formSchema = z
  .object({
    restaurantName: z.string({
      required_error: "restaurant name is required",
    }),
    city: z.string({
      required_error: "city is required",
    }),
    country: z.string({
      required_error: "country is required",
    }),
    deliveryPrice: z.coerce.number({
      required_error: "delivery price is required",
      invalid_type_error: "must be a valid number",
    }),
    estimatedDeliveryTime: z.coerce.number({
      required_error: "estimatedDeliveryTime is required",
      invalid_type_error: "must be a valid number",
    }),
    cuisines: z.array(z.string()).nonempty({
      message: "please select atleast one item",
    }),
    menuItems: z.array(
      z.object({
        name: z.string().min(1, "name is required"),
        price: z.coerce.number().min(1, "price is required"),
      })
    ),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "image is required" }).optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either image URL or image File must be provided",
    path: ["imageFile"],
  });

type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
  restaurant?: Restaurant;
};

const ManageRestaurantForm = ({ onSave, isLoading, restaurant }: Props) => {
  const onSubmit = (fromDataJson: RestaurantFormData) => {
    const formData = new FormData();

    formData.append("restaurantName", fromDataJson.restaurantName);
    formData.append("city", fromDataJson.city);
    formData.append("country", fromDataJson.country);
    formData.append("deliveryPrice", fromDataJson.deliveryPrice.toString());
    formData.append(
      "estimatedDeliveryTime",
      fromDataJson.estimatedDeliveryTime.toString()
    );
    fromDataJson.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });
    fromDataJson.menuItems.forEach((menuItem, index) => {
      formData.append(`menuItems[${index}][name]`, menuItem.name);
      formData.append(`menuItems[${index}][price]`, menuItem.price.toString());
    });
    if (fromDataJson.imageFile)
      formData.append(`imageFile`, fromDataJson.imageFile);
    onSave(formData);
  };

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
    },
  });

  useEffect(() => {
    if (!restaurant) {
      return;
    }
    const formattedDeliveryPrice = parseInt(restaurant.deliveryPrice);
    const formattedEstimatedDeliveryTime = parseInt(
      restaurant.estimatedDeliveryTime
    );
    const updatedRestaurant = {
      ...restaurant,
      deliveryPrice: formattedDeliveryPrice,
      estimatedDeliveryTime: formattedEstimatedDeliveryTime,
    };

    form.reset(updatedRestaurant);
  }, [form, restaurant]);

  return (
    <Form {...form}>
      <form
        {...form}
        onSubmit={form.handleSubmit(onSubmit)}
        className="sapce-y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailsSection />
        <Separator className="my-6" />
        <CuisinesSection />
        <Separator className="my-6" />
        <MenuSection />
        <Separator className="my-6" />
        <ImageSection />

        {isLoading ? (
          <LoadingButton />
        ) : (
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
