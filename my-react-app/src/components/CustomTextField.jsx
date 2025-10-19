import { TextField } from "@mui/material";

export default function CustomTextField(props) {
  return (
     <TextField
      margin="normal"
      required
      fullWidth
      size="small"
      sx={{
        
        "& .MuiInputBase-root": {
          backgroundColor: "#f5f5f5",
          borderRadius: 4,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#aaa",
        },
        
        ...props.sx, 
      }}
      {...props} 
    />
  );
}