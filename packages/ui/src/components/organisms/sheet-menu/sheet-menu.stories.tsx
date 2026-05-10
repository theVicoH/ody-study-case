import { SheetMenu } from "./sheet-menu.organism";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SheetMenu> = {
  title: "Components/Organisms/SheetMenu",
  component: SheetMenu,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof SheetMenu>;

const STORY_IMAGES = [
  "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80&auto=format&fit=crop"
];

export const Default: Story = {
  args: {
    items: [
      {
        id: "1",
        name: "Salade niçoise",
        category: "Entrées",
        price: 12.5,
        available: true,
        image: STORY_IMAGES[0]
      },
      {
        id: "2",
        name: "Soupe à l'oignon",
        category: "Entrées",
        price: 9.0,
        available: true,
        image: STORY_IMAGES[1]
      },
      {
        id: "3",
        name: "Entrecôte grillée",
        category: "Plats",
        price: 28.0,
        available: true,
        image: STORY_IMAGES[2]
      },
      {
        id: "4",
        name: "Saumon en croûte",
        category: "Plats",
        price: 24.5,
        available: false,
        image: STORY_IMAGES[3]
      },
      {
        id: "5",
        name: "Crème brûlée",
        category: "Desserts",
        price: 8.0,
        available: true,
        image: STORY_IMAGES[4]
      },
      {
        id: "6",
        name: "Moelleux chocolat",
        category: "Desserts",
        price: 9.5,
        available: true,
        image: STORY_IMAGES[5]
      },
      {
        id: "7",
        name: "Eau minérale",
        category: "Boissons",
        price: 4.0,
        available: true,
        image: STORY_IMAGES[6]
      },
      {
        id: "8",
        name: "Plat du jour",
        category: "Carte du jour",
        price: 16.0,
        available: true,
        image: STORY_IMAGES[7]
      }
    ]
  }
};

export const Empty: Story = {
  args: {
    items: []
  }
};
