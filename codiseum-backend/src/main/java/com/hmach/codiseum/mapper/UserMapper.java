package com.hmach.codiseum.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import com.hmach.codiseum.model.User;
import com.hmach.codiseum.dto.UserDTO;
import com.hmach.codiseum.dto.UserDTOFull;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO toDto(User user);
    UserDTOFull toDtoFull(User user);
    User toEntity(UserDTO userDTO);

    List<UserDTO> toDto(List<User> users);
    List<UserDTOFull> toDtoFull(List<User> users);
}