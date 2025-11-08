package cloud.xcan.angus.core.ai.application.cmd.dataset.impl;

import static cloud.xcan.angus.core.ai.application.converter.DatasetDataConverter.toDatasetData;
import static cloud.xcan.angus.core.ai.domain.Constants.KNOWLEDGE_DOC_UPLOAD_BIZ_KEY;
import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.calculateDatasetType;

import cloud.xcan.angus.api.storage.file.FileRemote;
import cloud.xcan.angus.api.storage.file.vo.FileUploadVo;
import cloud.xcan.angus.core.ai.application.cmd.dataset.DatasetDataCmd;
import cloud.xcan.angus.core.ai.application.query.dataset.DatasetQuery;
import cloud.xcan.angus.core.ai.domain.dataset.Dataset;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetData;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetDataRepo;
import cloud.xcan.angus.core.ai.domain.dataset.SyncDataResult;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.BizException;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.spec.annotations.DoInFuture;
import cloud.xcan.angus.spec.utils.ObjectUtils;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.boot.autoconfigure.web.servlet.MultipartProperties;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@DoInFuture("添加权限校验")
@Service
public class DatasetDataCmdImpl extends CommCmd<DatasetData, Long> implements DatasetDataCmd {

  @Resource
  private DatasetDataRepo datasetDataRepo;

  @Resource
  private DatasetQuery datasetQuery;

  @Resource
  private FileRemote fileRemote;

  @Resource
  private MultipartProperties multipartProperties;

  @Override
  @Transactional
  public DatasetData uploadDatasetData(Long datasetId, MultipartFile file) {
    return new BizTemplate<DatasetData>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 检查数据集是否存在
        datasetDb = datasetQuery.findAndCheck(datasetId);

        // 检查文件格式
        if (calculateDatasetType(file.getOriginalFilename(), null) == null){
          throw ProtocolException.of(String.format("不支持的文件格式：%s",file.getOriginalFilename()));
        }

        // 检查文件大小限制
        long maxFileSize = multipartProperties.getMaxFileSize().toBytes();
        if (file.getSize() > maxFileSize) {
          throw ProtocolException.of(String.format("文件[%s]超过大小限制，最大允许上传%s",
              file.getOriginalFilename(), multipartProperties.getMaxFileSize().toString()));
        }
      }

      @Override
      protected DatasetData process() {
        // TODO: 启动异步处理任务（包括数据解析并入库）

        // 上传文件到文件存储服务
        List<FileUploadVo> uploadResult = fileRemote.upload(
            new MultipartFile[]{file}, null, KNOWLEDGE_DOC_UPLOAD_BIZ_KEY,
            null).orElseContentThrow();

        DatasetData data = toDatasetData(datasetId, file, uploadResult.get(0));
        insert(data);
        return data;
      }
    }.execute();
  }

  @Override
  @Transactional
  public List<SyncDataResult> syncDatasetData(Long datasetId, List<String> names) {
    return new BizTemplate<List<SyncDataResult>>() {
      Dataset datasetDb;

      @Override
      protected void checkParams() {
        // 获取数据集并检查是否存在
        datasetDb = datasetQuery.findAndCheck(datasetId);
      }

      @Override
      protected List<SyncDataResult> process() {
        if (datasetDb.getType().isDatasource()) {
          // TODO 同步表和统计信息
        } else {
          List<DatasetData> data = ObjectUtils.isEmpty(names)
              ? datasetDataRepo.findByDatasetId(datasetId)
              : datasetDataRepo.findByDatasetIdAndNameIn(datasetId, names);
          if (data.isEmpty()) {
            throw BizException.of("没有可同步的文件数据，请上传后再试");
          }

          // TODO 执行文件数据到数据库同步
        }
        return List.of();
      }
    }.execute();
  }

  @Override
  @Transactional
  public void batchDeleteData(Long id, @Nullable List<String> names) {
    new BizTemplate<Void>() {
      @Override
      protected Void process() {
        if (ObjectUtils.isEmpty(names)) {
          datasetDataRepo.deleteById(id);
        } else {
          datasetDataRepo.deleteByIdAndNameIn(id, names);
        }
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<DatasetData, Long> getRepository() {
    return datasetDataRepo;
  }
}
