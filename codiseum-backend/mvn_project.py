import xml.etree.ElementTree as ET
import os

class MavenProject:

    def __init__(self, path = os.getcwd()):
        
        self.path = os.path.dirname(self._find_dir(".mvn", path))
        self.pom_path = self._find_file("pom.xml", self.path)
        self.package_name = self._get_base_package_from_pom()
        self.model_dir = self._find_dir("model", self.path)
        self.repository_dir = self._find_dir("repository", self.path)
        self.service_dir = self._find_dir("service", self.path)
        self.controller_dir = self._find_dir("controller", self.path)

    def gen_crud(self, entity, model_enabled, repository_enabled, service_enabled, service_impl_enabled, controller_enabled):
        normalized_entity = entity[:1].upper() + entity.lower()[1:]

        model_name = normalized_entity + ".java"
        model_path = os.path.join(self.model_dir, model_name)
        
        repository_name = normalized_entity + "Repository.java"
        repository_path = os.path.join(self.repository_dir, repository_name)

        service_name = normalized_entity + "Service.java"
        service_path = os.path.join(self.service_dir, service_name)
        
        service_impl_name = normalized_entity + "ServiceImpl.java"
        service_impl_path = os.path.join(self.service_dir, service_impl_name)

        controller_name = normalized_entity + "Controller.java"
        controller_path = os.path.join(self.controller_dir, controller_name)

        # Model

        if model_enabled:
            with open(model_path, "w") as f:
                model_content = f"""package {self.package_name}.model;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class {normalized_entity} {{

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

}}"""
                f.write(model_content)

        # Repository
        if repository_enabled:
            with open(repository_path, "w") as f:
                repository_content = f"""package {self.package_name}.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import {self.package_name}.model.{normalized_entity};
            
@Repository
public interface {normalized_entity}Repository extends JpaRepository<{normalized_entity}, Long> {{
}}
"""
                f.write(repository_content)

        # Service
        if service_enabled:
            with open(service_path, "w") as f:
                service_content = f"""package {self.package_name}.service;

import {self.package_name}.model.{normalized_entity};

import java.util.List;
            
public interface {normalized_entity}Service {{

    public List<{normalized_entity}> getAll{normalized_entity}s();
    public {normalized_entity} get{normalized_entity}ById(Long id);
    public {normalized_entity} save{normalized_entity}({normalized_entity} {normalized_entity.lower()});
    public {normalized_entity} update{normalized_entity}ById(Long id, {normalized_entity} {normalized_entity.lower()});
    public void delete{normalized_entity}ById(Long id);

}}
"""
                f.write(service_content)

        # ServiceImpl
        if service_impl_enabled:
            with open(service_impl_path, "w") as f:
                service_impl_content = f"""package {self.package_name}.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
            
import {self.package_name}.model.{normalized_entity};
import {self.package_name}.repository.{normalized_entity}Repository;

import java.util.List;

@Service
public class {normalized_entity}ServiceImpl implements {normalized_entity}Service {{

    @Autowired
    private {normalized_entity}Repository {normalized_entity.lower()}Repository;

    @Override
    public List<{normalized_entity}> getAll{normalized_entity}s() {{
        return {normalized_entity.lower()}Repository.findAll();
    }}
    
    @Override
    public {normalized_entity} get{normalized_entity}ById(Long id) {{
        return {normalized_entity.lower()}Repository.findById(id).orElse(null);
    }}
    
    @Override
    public {normalized_entity} save{normalized_entity}({normalized_entity} {normalized_entity.lower()}) {{
        return {normalized_entity.lower()}Repository.save(new {normalized_entity}());
    }}

    @Override
    public {normalized_entity} update{normalized_entity}ById(Long id, {normalized_entity} {normalized_entity.lower()}) {{
        return {normalized_entity.lower()}Repository.save(new {normalized_entity}());
    }}

    @Override
    public void delete{normalized_entity}ById(Long id) {{
        {normalized_entity.lower()}Repository.deleteById(id);
    }}

}}
"""
                f.write(service_impl_content)

        # Controller
        if controller_enabled:
            with open(controller_path, "w") as f:
                controller_content = f"""package {self.package_name}.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
            
import {self.package_name}.model.{normalized_entity};
import {self.package_name}.service.{normalized_entity}Service;

import java.util.List;

@RestController     
public class {normalized_entity}Controller {{

    @Autowired
    private {normalized_entity}Service {normalized_entity.lower()}Service;

    @GetMapping
    public List<{normalized_entity}> getAll{normalized_entity}s() {{
        return {normalized_entity.lower()}Service.getAll{normalized_entity}s();
    }}

    @GetMapping
    public {normalized_entity} get{normalized_entity}ById(Long id) {{
        return {normalized_entity.lower()}Service.get{normalized_entity}ById(id);
    }}

    @PostMapping
    public {normalized_entity} create{normalized_entity}({normalized_entity} {normalized_entity.lower()}) {{
        return {normalized_entity.lower()}Service.save{normalized_entity}({normalized_entity.lower()});
    }}

    @PostMapping("/{{id}}")
    public {normalized_entity} update{normalized_entity}(@PathVariable Long id, {normalized_entity} {normalized_entity.lower()}) {{
        return {normalized_entity.lower()}Service.update{normalized_entity}ById(id, {normalized_entity.lower()});
    }}

    @GetMapping("{{id}}")
    public void delete{normalized_entity}(@PathVariable Long id) {{
        {normalized_entity.lower()}Service.delete{normalized_entity}ById(id);
    }}
    
}}
"""
                f.write(controller_content)

    def _find_file(self, target_file, current_path):
        for item in os.listdir(current_path):
            item_path = os.path.join(current_path, item)

            if os.path.isdir(item_path):
                found = self._find_file(target_file, item_path)
                if found:
                    return found
            else:
                if item == target_file:
                    return item_path
                    
        return None

    def _find_dir(self, target_dir, current_path):
        for item in os.listdir(current_path):
            item_path = os.path.join(current_path, item)

            if os.path.isdir(item_path):
                if item == target_dir:
                    return item_path
                else:
                    found = self._find_dir(target_dir, item_path)
                    if found:
                        return found
        return None
    
    def _get_base_package_from_pom(self):
        tree = ET.parse(self.pom_path)
        root = tree.getroot()

        # Detectar namespace automáticamente (aunque cambie la versión)
        namespace_uri = ""
        if root.tag.startswith("{"):
            namespace_uri = root.tag.split("}")[0].strip("{")

        # Verificamos que sea un namespace de Maven (flexible)
        if "http://maven.apache.org/POM/" not in namespace_uri:
            raise ValueError("No es un pom.xml válido o no tiene namespace de Maven")

        ns = {"m": namespace_uri}

        def find_text(tag):
            el = root.find(f"m:{tag}", ns)
            if el is None:
                el = root.find(f"m:parent/m:{tag}", ns)
            return el.text if el is not None else None

        group_id = find_text("groupId")
        artifact_id = find_text("artifactId")

        if group_id and artifact_id:
            return f"{group_id}.{artifact_id}"
        else:
            return None
        
if __name__ == "__main__":
    project = MavenProject()
    project.gen_crud(
        entity="Cosmetic",
        model_enabled=False, 
        repository_enabled=True,
        service_enabled=True,
        service_impl_enabled=True,
        controller_enabled=True
    )