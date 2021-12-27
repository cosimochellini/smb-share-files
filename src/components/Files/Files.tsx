import { Chip } from "@mui/material";
import { byString, byValue } from "sort-es";
import { useEffect, useState } from "react";
import { ResultCount } from "./ResultCount";
import { Nullable } from "../../types/generic";
import { S3Folder } from "../../classes/S3Folder";
import { S3FileGroup } from "../../classes/S3FileGroup";
import { AutoStories, Refresh, Search } from "@mui/icons-material";
import { FilesPlaceholders } from "../Placeholders/FilesPlaceholders";
import { Avatar, IconButton, InputAdornment, ListItem } from "@mui/material";
import { ListItemAvatar, ListItemText, TextField, List } from "@mui/material";
import { sharedConfiguration } from "../../instances/sharedConfiguration";
import { useS3Folders } from "../../hooks/state/useS3Folders.state";
import { LoadingButton } from "../Data/LoadingButton";

export type Props = {
  currentFolder: Nullable<S3Folder>;
  onSearch?: (query: S3FileGroup) => void;
  onClearFolder?: () => void;
};

const { itemsConfiguration } = sharedConfiguration;

export function Files(props: Props) {
  const { currentFolder } = props;
  const { folders, refreshFolders } = useS3Folders();

  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [displayedItems, setDisplayedItems] = useState([] as S3FileGroup[]);

  const handleDeleteAuthor = () => {
    props.onClearFolder?.();
  };

  useEffect(() => {
    setSelectedIndex(0);

    let items = (folders ?? []).flatMap((item) => item.Files);

    if (search) {
      const searchLower = search.trim().toLowerCase();

      items = items.filter(
        (i) =>
          i.Hierarchy.some((h) => h.toLowerCase().includes(searchLower)) ||
          i.Files.some((f) =>
            f.file.FileName.toLowerCase().includes(searchLower)
          )
      );
    }

    if (currentFolder) {
      items = items.filter((i) => i.Key?.includes(currentFolder.Key!));
    }

    setDisplayedItems(items.sort(byValue((x) => x.FileName, byString())));
  }, [search, folders, currentFolder]);

  return (
    <>
      <h1>Files</h1>

      <TextField
        label="Search for a file"
        type="search"
        sx={{
          width: { xs: "100%", sm: "90%" },
        }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end">
                <LoadingButton
                  type={"icon"}
                  clickAction={refreshFolders}
                  icon={<Refresh />}
                />
              </IconButton>
            </InputAdornment>
          ),

          startAdornment: currentFolder ? (
            <Chip
              variant="outlined"
              label={"Author: " + currentFolder.FolderName}
              onDelete={handleDeleteAuthor}
              sx={{ marginRight: "5px" }}
            />
          ) : null,
        }}
      />
      <List
        sx={{
          width: { xs: "100%", sm: "90%" },
        }}
      >
        {!folders ? (
          <FilesPlaceholders count={itemsConfiguration.maxCount} />
        ) : (
          displayedItems
            .slice(0, itemsConfiguration.maxCount)
            .map((file, i) => (
              <ListItem
                key={file.Key}
                sx={{ borderRadius: 6 }}
                selected={selectedIndex === i}
                onClick={() => props.onSearch?.(file)}
                onMouseEnter={(_) => setSelectedIndex(i)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <AutoStories />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={file.FileInfo.Name}
                  secondary={file.Hierarchy[0]}
                ></ListItemText>

                <Chip
                  size="small"
                  sx={{ marginX: "1px" }}
                  title={file.Files.map(({ extension }) => extension).join(" ")}
                  label={file.Files.map((f) =>
                    f.extension[0].toUpperCase()
                  ).join(" ")}
                />
              </ListItem>
            ))
        )}
      </List>
      <ResultCount
        displayName="files"
        totalItems={displayedItems.length}
        displayedItems={itemsConfiguration.maxCount}
      />
    </>
  );
}
