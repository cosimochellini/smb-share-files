import { useEffect, useState } from "react";
import { S3Folder } from "../../classes/S3Folder";
import { formatter } from "../../formatters/formatter";
import { Folder as FolderIcon, Search } from "@mui/icons-material";
import { FilesPlaceholders } from "../Placeholders/FilesPlaceholders";
import { Avatar, IconButton, InputAdornment, ListItem } from "@mui/material";
import { ListItemAvatar, ListItemText, TextField, List } from "@mui/material";

type Props = {
  loading: boolean;
  folders: S3Folder[];
  onSearch: (query: S3Folder) => void;
};

export function Folders(props: Props) {
  const { loading, folders } = props;

  const [search, setSearch] = useState("");
  const [hoveredItem, setHoveredItem] = useState(0);
  const [displayedItems, setDisplayedItems] = useState([] as typeof folders);

  useEffect(() => {
    let items = folders;

    if (search) {
      const searchLower = search.toLowerCase();

      items = items.filter((i) =>
        i.Key?.toLocaleLowerCase().includes(searchLower)
      );
    }

    setDisplayedItems(items);
  }, [search, folders]);

  return (
    <>
      <h1>Authors</h1>

      <TextField
        label="Search for author"
        type="search"
        sx={{
          width: "100%",
          maxWidth: 720,
          bgcolor: "background.paper",
          borderColor: "black",
        }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end">
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
        }}
      >
        {loading
          ? FilesPlaceholders(6)
          : displayedItems.map((item, i) => (
              <ListItem
                key={i}
                selected={hoveredItem === i}
                onMouseEnter={(_) => setHoveredItem(i)}
                onClick={() => props.onSearch(item)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.FolderName}
                  secondary={formatter.dateFormatter(item.LastModified)}
                />
              </ListItem>
            ))}
      </List>
    </>
  );
}
